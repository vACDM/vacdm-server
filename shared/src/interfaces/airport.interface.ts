interface Airport {
  icao: string;

  standard_taxitime: number;

  taxizones: {
    polygon: string[];
    taxitimes: {
      rwy_designator: string;
      minutes: number;
    }[];
    label: string;
    taxiout: boolean;
  }[];

  capacities: {
    rwy_designator: string;
    capacity: number;
  }[];
}

export default Airport;
