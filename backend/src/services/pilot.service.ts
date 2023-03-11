import Pilot, { PilotLog } from '@shared/interfaces/pilot.interface';
import nestedobjectsUtils from '../utils/nestedobjects.utils';
import pilotModel, { PilotDocument } from '../models/pilot.model';
import airportService from './airport.service';
import timeUtils from '../utils/time.utils';
import cdmService from './cdm.service';
import pilotLogModel, { PilotLogDocument } from '../models/pilotLog.model';
import archiveModel, { ArchiveDocument } from '../models/archive.model';

export async function getAllPilots(filter: { [key: string]: any } = {}) {
  try {
    const pilot: PilotDocument[] = await pilotModel.find(filter).exec();

    return pilot;
  } catch (e) {
    throw e;
  }
}

export async function getPilot(callsign: string): Promise<PilotDocument> {
  try {
    const pilot: PilotDocument | null = await pilotModel
      .findOne({ callsign })
      .exec();

    if (!pilot) {
      throw new Error('pilot not found');
    }

    return pilot;
  } catch (e) {
    throw e;
  }
}

export async function addPilot(pilot: Pilot): Promise<PilotDocument> {
  const pilotDocument: PilotDocument = new pilotModel(pilot);

  try {
    await calculations(pilotDocument);

    await pilotDocument.save();
  } catch (e) {
    throw e;
  }

  return pilotDocument;
}

export async function deletePilot(callsign: string): Promise<void> {
  try {
    const pilot = await pilotModel.findOne({callsign}).exec();

    const logs = await pilotLogModel.find({pilot: callsign}).exec();

    const archiveDocument = new archiveModel({
      pilot: pilot,
      logs: logs
    })

    await archiveDocument.save();
    
    
    await pilotModel.findOneAndDelete({ callsign }).exec();

    // also get rid of all log entries of pilot
    await pilotLogModel.deleteMany({ pilot: callsign }).exec();
  } catch (e) {
    throw e;
  }
}

export async function doesPilotExist(callsign: string): Promise<boolean> {
  try {
    const count = await pilotModel.count({ callsign }).exec();

    return count > 0;
  } catch (e) {
    throw e;
  }
}

export async function updatePilot(
  callsign: string,
  changes: Partial<Pilot>
): Promise<PilotDocument> {
  try {
    const pilot = await getPilot(callsign); 

    const changesOps =
      nestedobjectsUtils.getValidUpdateOpsFromNestedObject(changes);

    // do not allow changing callsign
    delete changesOps['callsign'];

    // if tobt is explicitly changed, set state to confirmed, unless tobt_state is explicitly set
    if (changesOps['vacdm.tobt'] && !changesOps['vacdm.tobt_state']) {
      changesOps['vacdm.tobt_state'] = 'CONFIRMED';
    }

    if (changes.vacdm?.tobt_state) {
      switch (changes.vacdm?.tobt_state) {
        case 'FLIGHTPLAN': {
          changesOps['vacdm.prio'] = 1;
          break;
        }
        case 'CONFIRMED': {
          changesOps['vacdm.prio'] = 3;
          break;
        }
        case 'CONFIRMED': {
          changesOps['vacdm.prio'] = 3;
          break;
        }
      }
    }

    // handle runway changes
    if (changesOps['clearance.dep_rwy'] && (changesOps['clearance.dep_rwy'] != pilot.clearance.dep_rwy)) {
      // runway changed, get rid of TSAT so calculations will run again
      changesOps['vacdm.tsat'] = timeUtils.emptyDate;
    }

    // necessary changes
    const pilotDocument = await pilotModel
      .findOneAndUpdate({ callsign }, { $set: changesOps }, { new: true })
      .exec();

    if (!pilotDocument) {
      throw new Error('pilot does not exist');
    }

    await calculations(pilotDocument);

    await pilotDocument.save();

    return pilotDocument;
  } catch (e) {
    throw e;
  }
}

async function calculations(pilot: PilotDocument): Promise<PilotDocument> {
  const allPilots: PilotDocument[] = await getAllPilots();

  // determine runway
  if (!pilot.inactive && timeUtils.isTimeEmpty(pilot.vacdm.tsat)) {
    try {
      let runwayDesignator: string = await airportService.determineRunway(
        pilot
      );

      pilot.vacdm.block_rwy_designator = runwayDesignator;

      await addLog({
        pilot: pilot.callsign,
        namespace: 'calculations',
        action: `determined runway ${runwayDesignator}`,
        data: {
          position: pilot.position,
          airport: pilot.flightplan.departure,
        },
      });
    } catch (error) {
      await addLog({
        pilot: pilot.callsign,
        namespace: 'calculations',
        action: 'failed to determine runway',
        data: {
          position: pilot.position,
          airport: pilot.flightplan.departure,
          error,
        },
      });
    }
  }

  // determine taxi zone
  if (!pilot.inactive && !pilot.vacdm.manual_exot) {
    try {
      let exotBefore = Number(pilot.vacdm.exot);
      let taxizoneBefore = String(pilot.vacdm.taxizone);

      let taxizone = await airportService.determineTaxizone(pilot);

      pilot.vacdm.exot = taxizone.exot;
      pilot.vacdm.taxizone = taxizone.taxizone;
      pilot.vacdm.taxizoneIsTaxiout = taxizone.taxiout;

      if (exotBefore != pilot.vacdm.exot || taxizoneBefore != pilot.vacdm.taxizone) {
        await addLog({
          pilot: pilot.callsign,
          namespace: 'calculations',
          action: `determined taxizone ${taxizone.taxizone}`,
          data: {
            position: pilot.position,
            taxizone,
            airport: pilot.flightplan.departure,
          },
        });
      }
    } catch (error) {
      await addLog({
        pilot: pilot.callsign,
        namespace: 'calculations',
        action: 'failed to determine taxizone',
        data: {
          position: pilot.position,
          airport: pilot.flightplan.departure,
          error,
        },
      });
    }
  }

  // put into blocks
  if (timeUtils.isTimeEmpty(pilot.vacdm.tsat)) {
    try {
      const { initialBlock, initialTtot } =
        cdmService.determineInitialBlock(pilot);

      pilot.vacdm.blockId = initialBlock;
      pilot.vacdm.ttot = initialTtot;
      
      // get rid of delay because it fucks with time calculation
      pilot.vacdm.delay = 0;

      const { finalBlock, finalTtot } = await cdmService.putPilotIntoBlock(
        pilot,
        allPilots
      );

      await addLog({
        pilot: pilot.callsign,
        namespace: 'calculations',
        action: `determined ttot`,
        data: { initialBlock, initialTtot, finalBlock, finalTtot },
      });
    } catch (error) {
      await addLog({
        pilot: pilot.callsign,
        namespace: 'calculations',
        action: `failed to determine ttot`,
        data: { error },
      });
    }
  }

  return pilot;
}

export async function addLog(logData: Partial<PilotLog>) {
  const logEntry = new pilotLogModel(logData);

  try {
    await logEntry.save();
  } catch (e) {
    throw e;
  }

  return logEntry;
}

export async function getPilotLogs(
  callsign: string
): Promise<PilotLogDocument[]> {
  try {
    const logentries: PilotLogDocument[] = await pilotLogModel
      .find({ pilot: callsign })
      .exec();

    return logentries;
  } catch (e) {
    throw e;
  }
}

export default {
  getAllPilots,
  getPilot,
  addPilot,
  deletePilot,
  doesPilotExist,
  updatePilot,
  addLog,
  getPilotLogs,
};
