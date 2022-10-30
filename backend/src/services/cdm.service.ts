import { AirportCapacity } from '@shared/interfaces/airport.interface';
import config from '../config';
import pilotModel, { PilotDocument } from '../models/pilot.model';
import blockUtils from '../utils/block.utils';
import timeUtils from '../utils/time.utils';
import airportService from './airport.service';

import Logger from '@dotfionn/logger';
import pilotService from './pilot.service';
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

  let initialTtot = timeUtils.addMinutes(pilot.vacdm.tobt, pilot.vacdm.exot);
  let initialBlock = blockUtils.getBlockFromTime(initialTtot);

  return {
    initialBlock,
    initialTtot,
  };
}

export async function putPilotIntoBlock(
  pilot: PilotDocument,
  allPilots: PilotDocument[]
): Promise<{ finalBlock: number; finalTtot: Date }> {
  // count all pilots in block
  const otherPilotsInBlock = allPilots.filter(
    (plt) =>
      plt.flightplan.departure == pilot.flightplan.departure &&
      plt.vacdm.block_rwy_designator == pilot.vacdm.block_rwy_designator &&
      plt.vacdm.blockId == pilot.vacdm.blockId &&
      plt._id != pilot._id
  );

  const cap: AirportCapacity = await airportService.getCapacity(
    pilot.flightplan.departure,
    pilot.vacdm.block_rwy_designator
  );

  if (cap.capacity > otherPilotsInBlock.length) {
    // pilot fits into block
    return setTime(pilot);
  }

  // pilot does not fit into block

  // check if other pilot could be moved out of block
  const nowPlusTen = timeUtils.addMinutes(new Date(), 10);

  const pilotsThatCouldBeMoved = otherPilotsInBlock.filter(
    (plt) =>
      plt.vacdm.tsat > nowPlusTen &&
      plt.vacdm.prio + plt.vacdm.delay < pilot.vacdm.prio + pilot.vacdm.delay
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

    return await setTime(pilot);
  }

  // no pilot could be moved to make space
  pilot.vacdm.blockId += 1;
  pilot.vacdm.delay += 1;

  return await putPilotIntoBlock(pilot, allPilots);
}

async function setTime(pilot: PilotDocument): Promise<{
  finalBlock: number;
  finalTtot: Date;
}> {
  if (pilot.vacdm.tsat > pilot.vacdm.tobt) {
    pilot.vacdm.ttot = blockUtils.getTimeFromBlock(pilot.vacdm.blockId);
    pilot.vacdm.tsat = timeUtils.addMinutes(
      pilot.vacdm.ttot,
      -pilot.vacdm.exot
    );
  }

  if (pilot.vacdm.tsat <= pilot.vacdm.tobt) {
    pilot.vacdm.tsat = pilot.vacdm.tobt;
    pilot.vacdm.ttot = timeUtils.addMinutes(pilot.vacdm.tsat, pilot.vacdm.exot);
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

export async function cleanupPilots() {
  // delete long inactive pilots
  const pilotsToBeDeleted = await pilotModel
    .find({
      inactive: true,
      updatedAt: {
        $lte: new Date(
          Date.now() - config().timeframes.timeSinceInactive
        ).getTime(),
      },
    })
    .exec();

  logger.debug(
    new Date(Date.now() - config().timeframes.timeSinceInactive),
    new Date()
  );

  logger.debug('pilotsToBeDeleted', pilotsToBeDeleted);

  for (let pilot of pilotsToBeDeleted) {
    pilotService.deletePilot(pilot.callsign);
    logger.debug('deleted inactive pilot', pilot.callsign);
  }

  // deactivate long not seen pilots
  const pilotsToBeDeactivated = await pilotModel
    .find({
      inactive: { $not: { $eq: true } },
      updatedAt: {
        $lt: new Date(
          Date.now() - config().timeframes.timeSinceLastSeen
        ).getTime(),
      },
    })
    .exec();

  logger.debug('pilotsToBeDeactivated', pilotsToBeDeactivated);

  for (let pilot of pilotsToBeDeactivated) {
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
  let currentBlockId = blockUtils.getBlockFromTime(new Date());
  let allAirports = await airportService.getAllAirports();

  let allPilots = await pilotService.getAllPilots();

  const nowPlusTen = timeUtils.addMinutes(new Date(), 10);

  for (let airport of allAirports) {
    let visitedRwyDesignators: String[] = [];

    for (let rwy of airport.capacities) {
      let thisRunwayDesignator = rwy.alias || rwy.rwy_designator;

      if (visitedRwyDesignators.includes(thisRunwayDesignator)) {
        continue;
      }

      visitedRwyDesignators.push(thisRunwayDesignator);

      const pilotsThisRwy = allPilots.filter(
        (pilot) =>
          pilot.flightplan.departure === airport.icao &&
          pilot.vacdm.block_rwy_designator === thisRunwayDesignator
      );

      const capacityThisRunway: AirportCapacity =
        await airportService.getCapacity(airport.icao, thisRunwayDesignator);

      // do it
      for (
        let firstBlockCounter = 0;
        firstBlockCounter < 6;
        firstBlockCounter++
      ) {
        let firstBlockId = (currentBlockId + firstBlockCounter) % 144;

        const pilotsInThisBlock = pilotsThisRwy.filter(
          (pilot) => pilot.vacdm.blockId == firstBlockId
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
          let otherBlockId = (firstBlockId + secondBlockCounter) % 144;

          const sortedMovablePilotsThisBlock = pilotsThisRwy
            .filter(
              (pilot) =>
                pilot.vacdm.blockId == otherBlockId &&
                pilot.vacdm.tsat > nowPlusTen &&
                pilot.vacdm.delay >= secondBlockCounter
            )
            .sort(
              (pilotA, pilotB) =>
                pilotA.vacdm.prio +
                pilotA.vacdm.delay -
                (pilotB.vacdm.prio + pilotB.vacdm.delay)
            );

          sortedMovablePilots.push(...sortedMovablePilotsThisBlock);
        }

        const pilotsToMove = sortedMovablePilots.slice(
          0,
          capacityThisRunway.capacity - pilotsInThisBlock
        );

        // move pilots to current block

        for (const pilot of pilotsToMove) {
          pilot.vacdm.delay -= pilot.vacdm.blockId - currentBlockId;
          pilot.vacdm.blockId = firstBlockId;

          console.log('==========>> setting pilot times', pilot.callsign);

          await setTime(pilot);
        }
      }
    }
  }
}

export default {
  determineInitialBlock,
  putPilotIntoBlock,
  cleanupPilots,
  optimizeBlockAssignments,
};
