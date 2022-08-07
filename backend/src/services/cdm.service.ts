import { AirportCapacity } from '@shared/interfaces/airport.interface';
import { PilotDocument } from '../models/pilot.model';
import blockUtils from '../utils/block.utils';
import timeUtils from '../utils/time.utils';
import airportService from './airport.service';

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
      plt._id != plt._id
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

    return setTime(pilot);
  }

  // no pilot could be moved to make space
  pilot.vacdm.blockId += 1;
  pilot.vacdm.delay += 1;

  return await putPilotIntoBlock(pilot, allPilots);
}

function setTime(pilot: PilotDocument): { finalBlock: number; finalTtot: Date } {
  if (pilot.vacdm.delay == 0) {
    pilot.vacdm.tsat = pilot.vacdm.tobt;

    pilot.log.push({
      time: new Date(),
      namespace: 'cdmService',
      action: 'assigned first block',
      data: {},
    });
  } else {
    pilot.vacdm.ttot = blockUtils.getTimeFromBlock(pilot.vacdm.blockId);
    pilot.vacdm.tsat = timeUtils.addMinutes(pilot.vacdm.ttot, -pilot.vacdm.exot);

    pilot.log.push({
      time: new Date(),
      namespace: 'cdmService',
      action: 'assigned block',
      data: {},
    });
  }

  return { finalBlock: pilot.vacdm.blockId, finalTtot: pilot.vacdm.ttot };
}

export default {
  determineInitialBlock,
  putPilotIntoBlock,
};
