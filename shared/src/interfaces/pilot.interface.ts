interface Pilot {
  callsign: string;

  position: {
    lat: number;
    lon: number;
  };

  vacdm: {
    eobt: Date;
    tobt: Date;
    tobt_state: 'GUESS' | 'FLIGHTPLAN' | 'CONFIRMED' | 'NOW';

    exot: number;
    manual_exot: boolean;

    tsat: Date;

    ctot: Date;
    ttot: Date;

    asat: Date;
    aobt: Date;

    delay: number;
    prio: number;

    sug: Date;
    pbg: Date;
    txg: Date;

    taxizone: string;
    taxizoneIsTaxiout: boolean;

    blockAssignment: Date;
    blockId: number;
    block_rwy_designator: string;
  };

  flightplan: {
    flight_rules: string;

    departure: string;
    arrival: string;
  };

  clearance: {
    dep_rwy: string;
    sid: string;
    initial_climb: string;
    assigned_squawk: string;
    current_squawk: string;
  };

  measures: string[];
  inactive: boolean;

  // mongoose fields
  createdAt: Date;
  updatedAt: Date;
}

export interface PilotLog {
  pilot: string;
  time: Date;
  namespace: string;
  action: string;
  data: {
    [key: string]: any;
  };
}

export interface Archive {
  pilot: Pilot,
  logs: PilotLog[]
}

export interface AirportBlocks {
  icao: string;
  rwys: {
    [key: string]: {
      [key: number]: Pilot[];
    };
  };
}

export default Pilot;
