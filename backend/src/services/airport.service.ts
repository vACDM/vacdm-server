import Airport, { AirportTaxizone } from '@shared/interfaces/airport.interface';
import nestedobjectsUtils from '../utils/nestedobjects.utils';
import airportModel, { AirportDocument } from '../models/airport.model';
import { PilotDocument } from '../models/pilot.model';
import scopecoordsUtils from 'utils/scopecoords.utils';
import pointInPolygon from 'point-in-polygon';

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
  icao: string,
  changes: Partial<Airport>
): Promise<AirportDocument> {
  try {
    const pilotExists: boolean = await doesAirportExist(icao);

    if (!pilotExists) {
      throw new Error('pilot does not exist');
    }

    const changesOps =
      nestedobjectsUtils.getValidUpdateOpsFromNestedObject(changes);

    // necessary changes
    const pilot = await airportModel
      .findOneAndUpdate({ callsign: icao }, { $set: changesOps })
      .exec();

    if (!pilot) {
      throw new Error('airport does not exist');
    }

    return pilot;
  } catch (e) {
    throw e;
  }
}

export async function determineTaxizone(
  pilot: PilotDocument
): Promise<{ taxizone: string; exot: number }> {
  let icao: string = pilot.flightplan.departure;

  let airport: AirportDocument = await getAirport(icao);

  if (!airport) {
    throw new Error('pilot is not located at known airport');
  }

  let airportDefaultZone = {
    taxizone: 'default taxitime',
    exot: airport.standard_taxitime,
  };

  let pilotPos = [pilot.position.lat, pilot.position.lon];
  let taxizone: AirportTaxizone | undefined = undefined;

  for (let thisTaxizone of airport.taxizones) {
    let poly = thisTaxizone.polygon.map(
      scopecoordsUtils.parseAndConvertScopeCoords
    );
    if (pointInPolygon(pilotPos, poly)) {
      taxizone = thisTaxizone;
      break;
    }
  }

  if (!taxizone) {
    return airportDefaultZone;
  }

  let timeDefinition = taxizone.taxitimes.find(
    (def) => def.rwy_designator == pilot.clearance.dep_rwy
  );

  if (!timeDefinition) {
    return airportDefaultZone;
  }

  return {
    taxizone: taxizone.label,
    exot: timeDefinition.minutes,
  };
}

export default {
  getAllAirports,
  getAirport,
  addAirport,
  deleteAirport,
  doesAirportExist,
  updateAirport,
  determineTaxizone,
};
