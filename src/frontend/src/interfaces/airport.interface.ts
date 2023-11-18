import Airport, {
  AirportCapacity,
  AirportTaxizone,
} from '@/shared/interfaces/airport.interface';

export interface IAirport extends Airport {
  _id: string;
  taxizones: IAirportTaxizone[];
  capacities: IAirportCapacity[];
}

export interface IAirportCapacity extends AirportCapacity {
  _id: string | null;
}

export interface IAirportTaxizone extends AirportTaxizone {
  _id: string | null;
  taxitimes: {
    _id: string | null;
    rwy_designator: string;
    minutes: number;
  }[];
}

export interface IAirportTaxizoneTaxitime extends AirportTaxizone {
  _id: string | null;
}


