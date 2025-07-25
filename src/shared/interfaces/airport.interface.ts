export interface IAirport {
  id?: string;
  icao: string;

  defaultTaxitime: number;

  taxizones: IAirportTaxizone[];

  profiles: IAirportProfile[];

  capacityOverrides: IAirportCapacityOverride[];
}

export interface IAirportCapacityOverride {
  blockId: number;
  capacityIdentifier: string;
  newCapacity: number;
}

export interface IAirportProfile {
  capacities: IAirportCapacity[];
  forceActive: boolean;
  label: string;
  default: boolean;

  timetable?: IAirportProfileTimetable;
}

export interface IAirportProfileTimetable {
  /** blockId 0-143 */
  from: number;

  /** blockId 0-143 */
  until: number;
}

export interface IAirportTaxizoneTaxitime {
  runway: string;
  minutes: number;
}

export interface IAirportTaxizone {
  polygon: string[];
  taxitimes: IAirportTaxizoneTaxitime[];
  label: string;
  taxiout: boolean;
}

export interface IAirportCapacity {
  runways: string[];
  capacity: number;
  alias: string;
}

export default IAirport;
