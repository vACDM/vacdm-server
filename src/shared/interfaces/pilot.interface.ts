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
    suspended: boolean;

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

  operationalLog: OperationaLogEntry[];

  // mongoose fields
  createdAt: Date;
  updatedAt: Date;
}

export interface AirportBlocks {
  icao: string;
  rwys: {
    [key: string]: {
      [key: number]: Pilot[];
    };
  };
}

export interface OperationaLogEntry {
  time?: Date;
  logType: 'IM' | 'OM' | 'HI';
  event: string;
  content: string;
}

export default Pilot;
