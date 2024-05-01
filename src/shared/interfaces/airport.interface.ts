export interface Airport {
  id?: string;
  icao: string;

  region: string;

  standard_taxitime: number;

  taxizones: AirportTaxizone[];

  capacities: AirportCapacity[];
}

export interface AirportTaxizone {
  polygon: string[];
  taxitimes: {
    rwy_designator: string;
    minutes: number;
  }[];
  label: string;
  taxiout: boolean;
}

export interface AirportCapacity {
  rwy_designator: string;
  capacity: number;
  alias: string;
}

export default Airport;
