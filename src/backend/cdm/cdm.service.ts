import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { mongo } from 'mongoose';

import { EOpLogEvent, EOpLogType } from '../../shared/interfaces/pilot.interface';
import { AirportService } from '../airport/airport.service';
import logger from '../logger';
import { PilotDocument } from '../pilot/pilot.model';
import { PilotService } from '../pilot/pilot.service';
import { Schedule } from '../schedule/schedule.decorator';
import { UtilsService } from '../utils/utils.service';

import { AirportCapacity } from '@/shared/interfaces/airport.interface';

interface IBlockAssignment {
  block: number;
  ttot: Date;
}

@Injectable()
export class CdmService {
  constructor(
    @Inject(forwardRef(() => AirportService)) private airportService: AirportService,
    @Inject(forwardRef(() => PilotService)) private pilotService: PilotService,
    private utilsService: UtilsService,
  ) {}

  determineInitialBlock(pilot: PilotDocument): IBlockAssignment {
    if (
      this.utilsService.isTimeEmpty(pilot.vacdm.tobt) &&
      !this.utilsService.isTimeEmpty(pilot.vacdm.eobt)
    ) {
      pilot.vacdm.tobt = pilot.vacdm.eobt;
      pilot.vacdm.tobtState = 'FLIGHTPLAN';
    }

    if (this.utilsService.isTimeEmpty(pilot.vacdm.tobt)) {
      logger.debug('%s: determineInitialBlock > TOBT is empty after using EOBT, assuming now +30 min', pilot.callsign);

      const nowPlus30 = new Date();
      nowPlus30.setMinutes(nowPlus30.getMinutes() + 30);
      pilot.vacdm.eobt = nowPlus30;
      pilot.vacdm.tobt = nowPlus30;
    }

    const initialTtot = this.utilsService.addMinutes(pilot.vacdm.tobt, pilot.vacdm.exot);
    const initialBlock = this.utilsService.getBlockFromTime(initialTtot);

    return {
      block: initialBlock,
      ttot: initialTtot,
    };
  }

  private async setTime(pilot: PilotDocument, earliestAllowableTtot: Date | number | void): Promise<IBlockAssignment> {
    if (
      pilot.vacdm.tsat > pilot.vacdm.tobt ||
      this.utilsService.getBlockFromTime(pilot.vacdm.ttot) != pilot.vacdm.blockId
    ) {
      pilot.vacdm.ttot = this.utilsService.getTimeFromBlock(pilot.vacdm.blockId);
      pilot.vacdm.tsat = this.utilsService.addMinutes(pilot.vacdm.ttot, -pilot.vacdm.exot);
    }

    if (pilot.vacdm.tsat <= pilot.vacdm.tobt) {
      pilot.vacdm.tsat = pilot.vacdm.tobt;
      pilot.vacdm.ttot = this.utilsService.addMinutes(pilot.vacdm.tsat, pilot.vacdm.exot);
    }

    if (earliestAllowableTtot && pilot.vacdm.ttot <= earliestAllowableTtot) {
      pilot.vacdm.ctot = new Date(earliestAllowableTtot);
    }

    if (!this.utilsService.isTimeEmpty(pilot.vacdm.ctot)) {
      pilot.vacdm.blockId = this.utilsService.getBlockFromTime(pilot.vacdm.ctot);
      pilot.vacdm.ttot = pilot.vacdm.ctot;
      pilot.vacdm.tsat = this.utilsService.addMinutes(pilot.vacdm.ctot, -pilot.vacdm.exot);
    }

    // await pilotService.addLog({
    //   pilot: pilot.callsign,
    //   namespace: 'cdmService',
    //   action: 'assigned block',
    //   data: { blockId: pilot.vacdm.blockId },
    // });

    // save pilot because it might take too long between selecting the block and actually saving
    await pilot.save();

    return { block: pilot.vacdm.blockId, ttot: pilot.vacdm.ttot };
  }

  async putPilotIntoBlock(
    pilot: PilotDocument,
    allPilots: PilotDocument[] | void,
    earliestAllowableTtot: Date | number | void,
  ): Promise<IBlockAssignment> {
    allPilots ??= await this.pilotService.getPilots({
      'flightplan.adep': pilot.flightplan.adep,
      'vacdm.blockRwyDesignator': pilot.vacdm.blockRwyDesignator,
      _id: { $ne: new mongo.ObjectId(pilot._id) },
    });

    // count all pilots in block
    const otherPilotsInBlock = allPilots.filter(otherPilot => String(otherPilot._id) !== String(pilot._id) && otherPilot.vacdm.blockId === pilot.vacdm.blockId);

    const cap: AirportCapacity = await this.airportService.getCapacityForRwyDesignator(
      pilot.flightplan.adep,
      pilot.vacdm.blockRwyDesignator,
    );

    if (cap.capacity > otherPilotsInBlock.length) {
      return this.setTime(pilot, earliestAllowableTtot);
    }

    // pilot does not fit into block

    // check if other pilot could be moved out of block
    const nowPlusTen = this.utilsService.addMinutes(new Date(), 10);

    const currentPilotDelay = this.utilsService.getBlockFromTime(pilot.vacdm.ttot) !== pilot.vacdm.blockId
      ? this.utilsService.getTimeFromBlock(pilot.vacdm.blockId).valueOf() - (pilot.vacdm.exot * 60000) - pilot.vacdm.tobt.valueOf()
      : 0;

    const pilotsThatCouldBeMoved = otherPilotsInBlock.filter(
      (otherPilot) =>
        otherPilot.vacdm.tsat > nowPlusTen &&
        otherPilot.vacdm.prio + otherPilot.vacdm.delay < pilot.vacdm.prio + currentPilotDelay &&
        this.utilsService.isTimeEmpty(pilot.vacdm.ctot),
    );

    pilotsThatCouldBeMoved.sort((pilotA, pilotB) => {
      return (
        (pilotA.vacdm.prio + pilotA.vacdm.delay) - (pilotB.vacdm.prio + pilotB.vacdm.delay) ||
        pilotA.vacdm.blockAssignment.valueOf() - pilotB.vacdm.blockAssignment.valueOf()
      );
    });

    if (pilotsThatCouldBeMoved.length > 0) {
      const pilotThatWillBeMoved = pilotsThatCouldBeMoved[0];

      pilotThatWillBeMoved.vacdm.blockId += 1;
      await pilotThatWillBeMoved.save();
      await this.pilotService.addOperationalLog(pilotThatWillBeMoved.callsign, { logType: EOpLogType.History, event: EOpLogEvent.MoveToNextBlock, content: `New block Id: ${pilotThatWillBeMoved.vacdm.blockId}` });

      await this.putPilotIntoBlock(pilotThatWillBeMoved, allPilots);

      return this.setTime(pilot, earliestAllowableTtot);
    }

    // no pilot could be moved to make space
    pilot.vacdm.blockId += 1;

    await pilot.save();
    await this.pilotService.addOperationalLog(pilot.callsign, { logType: EOpLogType.History, event: EOpLogEvent.MoveToNextBlock, content: `New block Id: ${pilot.vacdm.blockId}` });

    return this.putPilotIntoBlock(pilot, allPilots);
  }

  @Schedule()
  private async optimizeBlockAssignments(): Promise<void> {
    logger.debug('optimizer rein');
    const currentBlockId = this.utilsService.getBlockFromTime(new Date());
    const allAirports = await this.airportService.getAllAirports();

    const allPilots = await this.pilotService.getPilots();

    // const datafeedData = await datafeedService.getRawDatafeed();

    // for (const pilot of allPilots) {
    //   if (pilot.hasBooking) {
    //     continue;
    //   }

    //   const datafeedPilot = await datafeedService.getFlight(pilot.callsign, datafeedData);

    //   if (datafeedPilot) {
    //     const pilotHasBooking = await bookingsService.pilotHasBooking(datafeedPilot.cid);

    //     if (pilotHasBooking) {
    //       pilot.hasBooking = true;

    //       pilot.vacdm.prio += getAppConfig().eventPrio;
    //     }
    //   }
    // }

    for (const airport of allAirports) {
      const visitedRwyDesignators: string[] = [];

      for (const rwy of airport.capacities) {
        const thisRunwayDesignator = rwy.alias || rwy.rwy_designator;

        if (visitedRwyDesignators.includes(thisRunwayDesignator)) {
          continue;
        }

        visitedRwyDesignators.push(thisRunwayDesignator);

        const pilotsThisRwy = allPilots.filter(
          (pilot) =>
            pilot.flightplan.adep === airport.icao &&
            pilot.vacdm.blockRwyDesignator === thisRunwayDesignator,
        );

        const capacityThisRunway: AirportCapacity =
          await this.airportService.getCapacityForRwyDesignator(airport.icao, thisRunwayDesignator);

        // do it
        for (
          let firstBlockCounter = 0;
          firstBlockCounter < 60;
          firstBlockCounter++
        ) {
          const targetBlockId = currentBlockId + firstBlockCounter;

          const pilotsInThisBlock = pilotsThisRwy.filter((pilot) => pilot.vacdm.blockId == targetBlockId);

          const additionalSpace = capacityThisRunway.capacity - pilotsInThisBlock.length;

          if (additionalSpace < 0) {
            // block is overprovisioned

            const pilotsToMoveOut = pilotsInThisBlock.slice(additionalSpace);

            for (const pilot of pilotsToMoveOut) {
              logger.debug('de-optimizing pilot %s', pilot.callsign);
              await this.pilotService.addOperationalLog(pilot.callsign, { logType: EOpLogType.History, event: EOpLogEvent.DeOptimizeOverProvisionedBlock, content: 'Block has not enough space.' });

              await this.putPilotIntoBlock(pilot);
            }

            continue;
          } else if (additionalSpace === 0) {
            continue;
          }

          // TODO: for the future, we need to create a score on the relevance of each pilot in this array
          const sortedMovablePilots: PilotDocument[] = [];

          // sort pilots for block, prio, delay
          for (
            let secondBlockCounter = 1;
            secondBlockCounter < 7;
            secondBlockCounter++
          ) {
            const otherBlockId = targetBlockId + secondBlockCounter;

            const sortedMovablePilotsThisBlock = pilotsThisRwy
              .filter(
                (pilot) =>
                  pilot.vacdm.blockId === otherBlockId &&
                  pilot.vacdm.delay >= secondBlockCounter &&
                  this.utilsService.getBlockFromTime(this.utilsService.addMinutes(pilot.vacdm.tobt, pilot.vacdm.exot)) <=  targetBlockId,
              )
              .sort((pilotB, pilotA) => (pilotA.vacdm.prio + pilotA.vacdm.delay) - (pilotB.vacdm.prio + pilotB.vacdm.delay));

            sortedMovablePilots.push(...sortedMovablePilotsThisBlock);
          }

          const pilotsToMove = sortedMovablePilots.slice(0, additionalSpace);

          // move pilots to current block

          for (const pilot of pilotsToMove) {
            pilot.vacdm.blockId = targetBlockId;

            logger.debug('optimizing pilot %s', pilot.callsign);
            await this.pilotService.addOperationalLog(pilot.callsign, { logType: EOpLogType.History, event: EOpLogEvent.Optimized, content: `New block Id: ${pilot.vacdm.blockId}` });

            await this.setTime(pilot);
          }
        }
      }
    }
  }

  async isSpaceAvailInBlock(adep: string, rwyDesignator: string, blockId: number): Promise<boolean> {
    const cap: AirportCapacity = await this.airportService.getCapacityForRwyDesignator(adep, rwyDesignator);

    const count = await this.pilotService.countPilots({
      'flightplan.adep': adep,
      'vacdm.blockRwyDesignator': rwyDesignator,
      'vacdm.blockId': blockId,
    });

    return cap.capacity > count;
  }
}
