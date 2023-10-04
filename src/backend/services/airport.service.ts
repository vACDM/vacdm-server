import pointInPolygon from 'point-in-polygon';

import airportModel, { AirportDocument } from '../models/airport.model';
import { PilotDocument } from '../models/pilot.model';
import nestedobjectsUtils from '../utils/nestedobjects.utils';
import scopecoordsUtils from '../utils/scopecoords.utils';

import Airport, {
  AirportCapacity,
  AirportTaxizone,
} from '@/shared/interfaces/airport.interface';


export async function getAllAirports(filter: { [key: string]: any } = {}) {
  try {
    const pilot: AirportDocument[] = await airportModel.find(filter).exec();

    return pilot;
  } catch (e) {
    console.log('error getting all airports', e);
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
    console.log('error getting airport', icao, e);
    throw e;
  }
}

export async function addAirport(airport: Airport): Promise<AirportDocument> {
  const airportDocument: AirportDocument = new airportModel(airport);

  try {
    await airportDocument.save();
  } catch (e) {
    console.log('error saving airport', airport, e);
    throw e;
  }

  return airportDocument;
}

export async function deleteAirport(icao: string): Promise<void> {
  try {
    await airportModel.findOneAndDelete({ icao }).exec();
  } catch (e) {
    console.log('error deleting airport', icao);
    throw e;
  }
}

export async function doesAirportExist(icao: string): Promise<boolean> {
  try {
    const count = await airportModel.count({ icao }).exec();

    return count > 0;
  } catch (e) {
    console.log('error checking if airport exists', icao, e);
    throw e;
  }
}

export async function updateAirport(
  icao: string,
  changes: Partial<Airport>,
): Promise<AirportDocument> {
  try {
    const airportExists: boolean = await doesAirportExist(icao);

    if (!airportExists) {
      throw new Error('airport does not exist');
    }

    const changesOps =
      nestedobjectsUtils.getValidUpdateOpsFromNestedObject(changes);

    // necessary changes
    const airport = await airportModel
      .findOneAndUpdate({ icao }, { $set: changesOps })
      .exec();

    if (!airport) {
      throw new Error('airport does not exist');
    }

    return airport;
  } catch (e) {
    console.log('error updating airport', icao, changes, e);
    throw e;
  }
}

export async function determineTaxizone(
  pilot: PilotDocument,
): Promise<{ taxizone: string; exot: number; taxiout: boolean }> {
  const icao: string = pilot.flightplan.departure;

  let airport: AirportDocument | undefined = undefined;
  try {
    airport = await getAirport(icao);
  } catch (error) {
    console.log('airport does not exist', icao);
  }

  if (!airport) {
    throw new Error('pilot is not located at known airport');
  }

  const airportDefaultZone = {
    taxizone: 'default taxitime',
    exot: airport.standard_taxitime,
    taxiout: false,
  };

  const pilotPos = [pilot.position.lat, pilot.position.lon];
  let taxizone: AirportTaxizone | undefined = undefined;

  for (const thisTaxizone of airport.taxizones) {
    const poly = thisTaxizone.polygon.map(
      scopecoordsUtils.parseAndConvertScopeCoords,
    );
    if (pointInPolygon(pilotPos, poly)) {
      taxizone = thisTaxizone;
      break;
    }
  }

  if (!taxizone) {
    return airportDefaultZone;
  }

  const timeDefinition = taxizone.taxitimes.find(
    (def) => def.rwy_designator == pilot.clearance.dep_rwy,
  );

  if (!timeDefinition) {
    return airportDefaultZone;
  }

  return {
    taxizone: taxizone.label,
    exot: timeDefinition.minutes,
    taxiout: taxizone.taxiout,
  };
}

export async function getCapacity(
  icao: string,
  rwy_designator: string,
): Promise<AirportCapacity> {
  try {
    const airport: Airport = await getAirport(icao);

    const potentialCapacity: AirportCapacity | undefined =
      airport.capacities.find(
        (cap) =>
          cap.rwy_designator == rwy_designator || cap.alias == rwy_designator,
      );

    if (!potentialCapacity) {
      throw new Error('no fitting capacity available');
    }

    return potentialCapacity;
  } catch (e) {
    console.log('error getting capacity', icao, rwy_designator, e);
    throw e;
  }
}

export async function determineRunway(pilot: PilotDocument): Promise<string> {
  try {
    const icao: string = pilot.flightplan.departure;

    const capacityData: AirportCapacity = await getCapacity(
      icao,
      pilot.clearance.dep_rwy,
    );

    return capacityData.alias != ''
      ? capacityData.alias
      : capacityData.rwy_designator;
  } catch (e) {
    console.log('error determining runway', pilot, e);
    throw e;
  }
}

export async function getAllSupportedAirportsOrEmptyArray(): Promise<string[]> {
  try {
    const airports = await getAllAirports();

    return airports.map(a => a.icao);
  } catch (error) {
    return [];
  }
}

export default {
  getAllAirports,
  getAirport,
  addAirport,
  deleteAirport,
  doesAirportExist,
  updateAirport,
  determineTaxizone,
  determineRunway,
  getCapacity,

  getAllSupportedAirportsOrEmptyArray,
};
