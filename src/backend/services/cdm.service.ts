import Logger from '@dotfionn/logger';
import dayjs from 'dayjs';

import config from '../config';
import pilotModel, { PilotDocument } from '../models/pilot.model';
import userModel from '../models/user.model';
import blockUtils from '../utils/block.utils';
import timeUtils, { emptyDate } from '../utils/time.utils';

import airportService from './airport.service';
import bookingsService from './bookings.service';
import datafeedService from './datafeed.service';
import pilotService from './pilot.service';



import { AirportCapacity } from '@/shared/interfaces/airport.interface';
const logger = new Logger('vACDM:services:cdm');

export function determineInitialBlock(pilot: PilotDocument): {
  initialBlock: number;
  initialTtot: Date;
} {
  if (
    timeUtils.isTimeEmpty(pilot.vacdm.tobt) &&
    !timeUtils.isTimeEmpty(pilot.vacdm.eobt)
  ) {
    pilot.vacdm.tobt = pilot.vacdm.eobt;
    pilot.vacdm.tobt_state = 'FLIGHTPLAN';
  }

  if (timeUtils.isTimeEmpty(pilot.vacdm.tobt)) {
    throw new Error('no time given!');
  }

  const initialTtot = timeUtils.addMinutes(pilot.vacdm.tobt, pilot.vacdm.exot);
  const initialBlock = blockUtils.getBlockFromTime(initialTtot);

  return {
    initialBlock,
    initialTtot,
  };
}

async function setTime(pilot: PilotDocument): Promise<{
  finalBlock: number;
  finalTtot: Date;
}> {
  if (
    pilot.vacdm.tsat > pilot.vacdm.tobt ||
    blockUtils.getBlockFromTime(pilot.vacdm.ttot) != pilot.vacdm.blockId
  ) {
    pilot.vacdm.ttot = blockUtils.getTimeFromBlock(pilot.vacdm.blockId);
    pilot.vacdm.tsat = timeUtils.addMinutes(
      pilot.vacdm.ttot,
      -pilot.vacdm.exot,
    );
  }

  if (pilot.vacdm.tsat <= pilot.vacdm.tobt) {
    pilot.vacdm.tsat = pilot.vacdm.tobt;
    pilot.vacdm.ttot = timeUtils.addMinutes(pilot.vacdm.tsat, pilot.vacdm.exot);
  }

  if (!timeUtils.isTimeEmpty(pilot.vacdm.ctot)) {
    pilot.vacdm.blockId = blockUtils.getBlockFromTime(pilot.vacdm.ctot);
    pilot.vacdm.ttot = pilot.vacdm.ctot;
    pilot.vacdm.tsat = timeUtils.addMinutes(
      pilot.vacdm.ctot,
      -pilot.vacdm.exot,
    );
  }

  await pilotService.addLog({
    pilot: pilot.callsign,
    namespace: 'cdmService',
    action: 'assigned block',
    data: { blockId: pilot.vacdm.blockId },
  });

  // save pilot because it might take too long between selecting the block and actually saving
  await pilot.save();

  return { finalBlock: pilot.vacdm.blockId, finalTtot: pilot.vacdm.ttot };
}

export async function putPilotIntoBlock(
  pilot: PilotDocument,
  allPilots: PilotDocument[],
): Promise<{ finalBlock: number; finalTtot: Date }> {
  // count all pilots in block
  pilot.vacdm.ctot = emptyDate;
  const otherPilotsOnRunway = allPilots.filter(
    (plt) =>
      plt.flightplan.departure == pilot.flightplan.departure &&
      plt.vacdm.block_rwy_designator == pilot.vacdm.block_rwy_designator &&
      plt._id != pilot._id,
  );
  const otherPilotsInBlock = otherPilotsOnRunway.filter(plt => plt.vacdm.blockId == pilot.vacdm.blockId);

  const cap: AirportCapacity = await airportService.getCapacity(
    pilot.flightplan.departure,
    pilot.vacdm.block_rwy_designator,
  );

  if (cap.capacity > otherPilotsInBlock.length) {
    // pilot fits into block
    // now we have to check if pilots in block have same measures and need a MDI therefore

    for (const measure of pilot.measures) {
      const pilotsWithSameMeasures = otherPilotsOnRunway.filter(
        (plt) =>
          plt.measures.find((e) => e.ident === measure.ident) &&
          plt.callsign != pilot.callsign,
      );
      if (pilotsWithSameMeasures.length > 0) {
        for (const smp of pilotsWithSameMeasures) {
          if (
            dayjs(smp.vacdm.ttot).diff(pilot.vacdm.ttot, 'minute') <
            Math.ceil(measure.value / 60)
          ) {
            pilot.vacdm.ctot = timeUtils.addMinutes(
              smp.vacdm.ttot,
              Math.ceil(measure.value / 60),
            );
          }
        }
      }
    }

    return setTime(pilot);
  }

  // pilot does not fit into block

  // check if other pilot could be moved out of block
  const nowPlusTen = timeUtils.addMinutes(new Date(), 10);

  const pilotsThatCouldBeMoved = otherPilotsInBlock.filter(
    (plt) =>
      plt.vacdm.tsat > nowPlusTen &&
      plt.vacdm.prio + plt.vacdm.delay < pilot.vacdm.prio + pilot.vacdm.delay,
  );

  pilotsThatCouldBeMoved.sort((pilotA, pilotB) => {
    return (
      pilotA.vacdm.prio +
        pilotA.vacdm.delay -
        (pilotB.vacdm.prio + pilotB.vacdm.delay) ||
      pilotB.vacdm.blockAssignment.valueOf() -
        pilotA.vacdm.blockAssignment.valueOf()
    );
  });

  if (pilotsThatCouldBeMoved.length > 0) {
    const pilotThatWillBeMoved = pilotsThatCouldBeMoved[0];

    pilotThatWillBeMoved.vacdm.blockId += 1;
    pilotThatWillBeMoved.vacdm.delay += 1;

    await putPilotIntoBlock(pilotThatWillBeMoved, allPilots);

    return setTime(pilot);
  }

  // no pilot could be moved to make space
  pilot.vacdm.blockId += 1;
  pilot.vacdm.delay += 1;

  return putPilotIntoBlock(pilot, allPilots);
}

export async function cleanupPilots() {
  // delete long inactive pilots
  const pilotsToBeDeleted = await pilotModel
    .find({
      inactive: true,
      updatedAt: {
        $lte: new Date(
          Date.now() - config().timeframes.timeSinceInactive,
        ).getTime(),
      },
    })
    .exec();

  logger.debug('pilotsToBeDeleted', pilotsToBeDeleted);

  for (const pilot of pilotsToBeDeleted) {
    pilotService.deletePilot(pilot.callsign);
    logger.debug('deleted inactive pilot', pilot.callsign);
  }

  // deactivate long not seen pilots
  const pilotsToBeDeactivated = await pilotModel
    .find({
      inactive: { $not: { $eq: true } },
      updatedAt: {
        $lt: new Date(
          Date.now() - config().timeframes.timeSinceLastSeen,
        ).getTime(),
      },
    })
    .exec();

  logger.debug('pilotsToBeDeactivated', pilotsToBeDeactivated);

  for (const pilot of pilotsToBeDeactivated) {
    pilot.inactive = true;

    await pilotService.addLog({
      pilot: pilot.callsign,
      namespace: 'worker',
      action: 'deactivated pilot',
      data: {
        updated: pilot.updatedAt,
      },
    });

    logger.debug('deactivating pilot', pilot.callsign);

    await pilot.save();
  }
}

export async function optimizeBlockAssignments() {
  const currentBlockId = blockUtils.getBlockFromTime(new Date());
  const allAirports = await airportService.getAllAirports();

  const allPilots = await pilotService.getAllPilots();

  const datafeedData = await datafeedService.getRawDatafeed();

  for (const pilot of allPilots) {   
    if (pilot.hasBooking) {
      continue;
    }

    const datafeedPilot = await datafeedService.getFlight(pilot.callsign, datafeedData);

    if (datafeedPilot) {
      const pilotHasBooking = await bookingsService.pilotHasBooking(datafeedPilot.cid);
      
      if (pilotHasBooking) {
        pilot.hasBooking = true;
        
        pilot.vacdm.prio += config().eventPrio;
      }
    }
  }

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
          pilot.flightplan.departure === airport.icao &&
          pilot.vacdm.block_rwy_designator === thisRunwayDesignator,
      );

      const capacityThisRunway: AirportCapacity =
        await airportService.getCapacity(airport.icao, thisRunwayDesignator);

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

          console.log('==========>> setting pilot times', pilot.callsign);

          await setTime(pilot);
        }
      }
    }
  }
}

export async function cleanupUsers() {
  const usersToBeDeleted = await userModel
    .find({
      vacdm: {
        admin: false,
        atc: false,
        banned: false,
      },
      updatedAt: {
        $lte: new Date(Date.now() - config().timeframes.timeSinceLastLogin).getTime(),
      },
    })
    .exec();

  await Promise.allSettled(usersToBeDeleted.map(user => user.delete()));
}

export default {
  determineInitialBlock,
  putPilotIntoBlock,
  cleanupPilots,
  optimizeBlockAssignments,
  cleanupUsers,
};
