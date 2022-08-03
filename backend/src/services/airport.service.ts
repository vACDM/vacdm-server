import Airport from '@shared/interfaces/airport.interface';
import nestedobjectsUtils from '../utils/nestedobjects.utils';
import airportModel, { AirportDocument } from '../models/airport.model';

export async function getAllAirports(filter: { [key: string]: any } = {}) {
  try {
    const pilot: AirportDocument[] = await airportModel.find(filter).exec();

    return pilot;
  } catch (e) {
    throw e;
  }
}

export async function getAirport(icao: string): Promise<AirportDocument> {
  try {
    const airport: AirportDocument | null = await airportModel
      .findOne({ icao })
      .exec();

    if (!airport) {
      throw new Error('airport not found');
    }

    return airport;
  } catch (e) {
    throw e;
  }
}

export async function addAirport(airport: Airport): Promise<AirportDocument> {
  const airportDocument: AirportDocument = new airportModel(airport);

  try {
    await airportDocument.save();
  } catch (e) {
    throw e;
  }

  return airportDocument;
}

export async function deleteAirport(icao: string): Promise<void> {
  try {
    await airportModel.findOneAndDelete({ icao }).exec();
  } catch (e) {
    throw e;
  }
}

export async function doesAirportExist(icao: string): Promise<boolean> {
  try {
    const count = await airportModel.count({ icao }).exec();

    return count > 0;
  } catch (e) {
    throw e;
  }
}

export async function updateAirport(
  callsign: string,
  changes: Partial<Airport>
): Promise<AirportDocument> {
  try {
    const pilotExists: boolean = await doesAirportExist(callsign);

    if (!pilotExists) {
      throw new Error('pilot does not exist');
    }

    const changesOps =
      nestedobjectsUtils.getValidUpdateOpsFromNestedObject(changes);

    // necessary changes
    const pilot = await airportModel
      .findOneAndUpdate({ callsign }, { $set: changesOps })
      .exec();

    if (!pilot) {
      throw new Error('airport does not exist');
    }

    return pilot;
  } catch (e) {
    throw e;
  }
}

export default {
  getAllAirports,
  getAirport,
  addAirport,
  deleteAirport,
  doesAirportExist,
  updateAirport,
};
