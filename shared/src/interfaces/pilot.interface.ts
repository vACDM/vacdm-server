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

    exot: Number;
    manual_exot: boolean;

    tsat: Date;

    ctot: Date;
    ttot: Date;

    asat: Date;
    aobt: Date;

    delay: Number;
    prio: Number;

    sug: Date;
    pbg: Date;
    txg: Date;

    taxizone: string;

    blockAssignment: Date;
    blockID: Number;
    block_rwy_designator: String;
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

  log: {
    time: Date;
    namespace: string;
    action: string;
    data: {
      [key: string]: any;
    };
  }[];

  inactive: boolean;

  // mongoose fields
  createdAt: Date;
  updatedAt: Date;
}

export default Pilot;
