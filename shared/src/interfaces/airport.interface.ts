export interface Airport {
  icao: string;

  standard_taxitime: number;

  taxizones: AirportTaxizone[];

  capacities: {
    rwy_designator: string;
    capacity: number;
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

export default Airport;
