import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { mongo } from 'mongoose';

import { AirportService } from '../airport/airport.service';
import logger from '../logger';
import { PilotDocument } from '../pilot/pilot.model';
import { PilotService } from '../pilot/pilot.service';
import { UtilsService } from '../utils/utils.service';

import { AirportCapacity } from '@/shared/interfaces/airport.interface';

interface IBlockAssignment {
  finalBlock: number;
  finalTtot: Date;
}

@Injectable()
export class CdmService {
  constructor(
    @Inject(forwardRef(() => AirportService)) private airportService: AirportService,
    @Inject(forwardRef(() => PilotService)) private pilotService: PilotService,
    private utilsService: UtilsService,
  ) {}

  determineInitialBlock(pilot: PilotDocument): {
    initialBlock: number;
    initialTtot: Date;
  } {
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
      initialBlock,
      initialTtot,
    };
  }

  async setTime(pilot: PilotDocument): Promise<IBlockAssignment> {
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

    return { finalBlock: pilot.vacdm.blockId, finalTtot: pilot.vacdm.ttot };
  }

  async putPilotIntoBlock(
    pilot: PilotDocument,
    allPilots: PilotDocument[] | void,
  ): Promise<IBlockAssignment> {
    if (!allPilots) {
      allPilots = await this.pilotService.getPilots({
        'flightplan.adep': pilot.flightplan.adep,
        'vacdm.blockRwyDesignator': pilot.vacdm.blockRwyDesignator,
        _id: { $ne: new mongo.ObjectId(pilot._id) },
      });
    }

    // count all pilots in block
    const otherPilotsInBlock = allPilots.filter(plt => plt.vacdm.blockId == pilot.vacdm.blockId);

    const cap: AirportCapacity = await this.airportService.getCapacityForRwyDesignator(
      pilot.flightplan.adep,
      pilot.vacdm.blockRwyDesignator,
    );

    if (cap.capacity > otherPilotsInBlock.length) {
      return this.setTime(pilot);
    }

    // pilot does not fit into block

    // check if other pilot could be moved out of block
    const nowPlusTen = this.utilsService.addMinutes(new Date(), 10);

    const pilotsThatCouldBeMoved = otherPilotsInBlock.filter(
      (plt) =>
        plt.vacdm.tsat > nowPlusTen &&
        plt.vacdm.prio + plt.vacdm.delay < pilot.vacdm.prio + pilot.vacdm.delay,
    );

    pilotsThatCouldBeMoved.sort((pilotA, pilotB) => {
      return (
        (pilotA.vacdm.prio + pilotA.vacdm.delay) - (pilotB.vacdm.prio + pilotB.vacdm.delay) ||
        pilotB.vacdm.blockAssignment.valueOf() - pilotA.vacdm.blockAssignment.valueOf()
      );
    });

    if (pilotsThatCouldBeMoved.length > 0) {
      const pilotThatWillBeMoved = pilotsThatCouldBeMoved[0];

      pilotThatWillBeMoved.vacdm.blockId += 1;
      pilotThatWillBeMoved.vacdm.delay += 1;

      await this.putPilotIntoBlock(pilotThatWillBeMoved, allPilots);

      return this.setTime(pilot);
    }

    // no pilot could be moved to make space
    pilot.vacdm.blockId += 1;
    pilot.vacdm.delay += 1;

    return this.putPilotIntoBlock(pilot, allPilots);
  }

  async optimizeBlockAssignments() {
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
          const firstBlockId = (currentBlockId + firstBlockCounter) % 144;

          const pilotsInThisBlock = pilotsThisRwy.filter(
            (pilot) => pilot.vacdm.blockId == firstBlockId,
          ).length;

          // check for available space
          if (capacityThisRunway.capacity <= pilotsInThisBlock) {
            // no space avail
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
            const otherBlockId = (firstBlockId + secondBlockCounter) % 144;

            const sortedMovablePilotsThisBlock = pilotsThisRwy
              .filter(
                (pilot) =>
                  pilot.vacdm.blockId == otherBlockId &&
                  pilot.vacdm.delay >= secondBlockCounter,
              )
              .sort(
                (pilotA, pilotB) =>
                  pilotA.vacdm.prio +
                  pilotA.vacdm.delay -
                  (pilotB.vacdm.prio + pilotB.vacdm.delay),
              );

            sortedMovablePilots.push(...sortedMovablePilotsThisBlock);
          }

          const pilotsToMove = sortedMovablePilots.slice(
            0,
            capacityThisRunway.capacity - pilotsInThisBlock,
          );

          // move pilots to current block

          for (const pilot of pilotsToMove) {
            pilot.vacdm.delay -= (144 + pilot.vacdm.blockId - firstBlockId) % 144;
            pilot.vacdm.blockId = firstBlockId;

            logger.debug('==========>> setting pilot times %o', pilot.callsign);

            await this.setTime(pilot);
          }
        }
      }
    }
  }
}
