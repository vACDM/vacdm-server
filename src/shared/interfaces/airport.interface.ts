export interface Airport {
  icao: string;

  standard_taxitime: number;

  taxizones: AirportTaxizone[];

  capacities: AirportCapacity[];

  activeProfile: string;

  profiles: {
    id: string;
    capacities: AirportCapacity[];
  }[];
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
