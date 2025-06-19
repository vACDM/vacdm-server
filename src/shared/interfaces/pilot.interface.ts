export enum EOpLogType {
  Incoming = 'IM',
  Outgoing = 'OM',
  History = 'HI',
}

export enum EOpLogEvent {
  MoveToNextBlock = 'CdmService_MoveToNextBlock',
  DeOptimizeOverProvisionedBlock = 'CdmService_DeOptimizeOverProvisionedBlock',
  Optimized = 'CdmService_Optimized',

  DetermineRunway = 'PilotService_DetermineRunway',
  DetermineTaxiZone = 'PilotService_DetermineTaxiZone',
  DetermineInitialBlock = 'PilotService_DetermineInitialBlock',

  DetermineRunwayUpdate = 'PilotService_DetermineRunwayUpdate',
  DetermineTaxiZoneUpdate = 'PilotService_DetermineTaxiZoneUpdate',

  Deactivation = 'PilotService_deactivation',
}

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

  operationalLog: OperationalLogEntry[];

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

// TODO: we should to define OpLogEntry type like this
// export type OpLogEntry = {
//   time?: Date
// } & (
//   {
//     logType: EOpLogType.History
//   } & (
//     {
//       event: EOpLogEvent.DeOptimizeOverProvisionedBlock | EOpLogEvent.Deactivation
//     } | {
//       event: EOpLogEvent.DetermineInitialBlock;
//       content: {
//         blockId: number;
//         ttot: Date;
//       };
//     }
//   )
// );

export interface OperationalLogEntry {
  time?: Date;
  logType: EOpLogType;
  event: EOpLogEvent;
  content: string;
}

export default Pilot;
