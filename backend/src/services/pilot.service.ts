import Pilot from '@shared/interfaces/pilot.interface';
import nestedobjectsUtils from '../utils/nestedobjects.utils';
import pilotModel, { PilotDocument } from '../models/pilot.model';
import airportService from './airport.service';

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
    await pilotModel.findOneAndDelete({ callsign }).exec();
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
    const pilotExists: boolean = await doesPilotExist(callsign);

    if (!pilotExists) {
      throw new Error('pilot does not exist');
    }

    const changesOps =
      nestedobjectsUtils.getValidUpdateOpsFromNestedObject(changes);

    // do not allow changing callsign
    delete changesOps['callsign'];

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
  // determine taxi zone
  if (!pilot.inactive && !pilot.vacdm.manual_exot) {
    let taxizone = await airportService.determineTaxizone(pilot);

    pilot.vacdm.exot = taxizone.exot;
    pilot.vacdm.taxizone = taxizone.taxizone;

    pilot.log.push({
      time: new Date(),
      namespace: 'calculations',
      action: 'determined taxizone',
      data: { position: pilot.position, taxizone },
    });
  }

  return pilot;
}

export default {
  getAllPilots,
  getPilot,
  addPilot,
  deletePilot,
  doesPilotExist,
  updatePilot,
};
