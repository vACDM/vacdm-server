interface Pilot {
  callsign: string;

  position: {
    lat: number;
    lon: number;
  };

  vacdm: {
    eobt: Date;
    tobt: Date;
    tobtState: 'FLIGHTPLAN' | 'CONFIRMED' | 'NOW';

    exot: number;
    manualExot: boolean;

    tsat: Date;

    ctot: Date;
    ttot: Date;

    asat: Date;
    aobt: Date;

    asrt: Date;
    aort: Date;

    delay: number;
    prio: number;

    sug: Date;
    pbg: Date;
    txg: Date;

    taxizone: string;
    taxizoneIsTaxiout: boolean;

    blockAssignment: Date;
    blockId: number;
    blockRwyDesignator: string;
  };

  hasBooking: boolean;

  flightplan: {
    adep: string;
    ades: string;
  };

  clearance: {
    dep_rwy: string;
    sid: string;
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
  data: object
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
