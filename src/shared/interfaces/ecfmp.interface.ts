export interface EcfmpPlugin {
  events: EcfmpEvent[];
  flight_information_regions: EcfmpFir[];
  flow_measures: EcfmpMeasure[];
}

export interface EcfmpMeasure {
  id: number;
  ident: string;
  event_id: number;
  enabled: boolean;
  reason: string;
  starttime: Date;
  endtime: Date;
  withdrawn_at: Date | null;
  measure: EcfmpMeasureAction;
  filters: EcfmpFilter[];
}

export type EcfmpMeasureAction = {
  type: 'minimum_departure_interval' | 'average_departure_interval';

  /** The number of seconds applicable to this measure */
  value: number;
} | {
  type: 'per_hour';

  /** The number of flights per hour permitted */
  value: number;
} | {
  type: 'ground_stop';
  value: null;
} | {
  type: 'miles_in_trail' | 'max_ias' | 'max_mach' | 'ias_reduction' | 'mach_reduction' | 'prohibit' | 'mandatory_route';
  value: unknown;
};

export type EcfmpFilter = {
  type: 'ADEP' | 'ADES' | 'waypoint',
  value: string[]
} | {
  type: 'level_above' | 'level_below',
  value: number
} | {
  type: 'level',
  value: number[]
} | {
  type: 'member_event' | 'member_not_event',
  value: EcfmpEvent[]
} /* | {
  type: string,
  value: string[] | number[] | string | number | EcfmpEvent[]
} */;

export interface EcfmpEvent {
  id: number;
  name: string;
  date_start: string;
  date_end: string;
  flight_information_region_id: number;
  vatcan_code: string | null;
  participants: EcfmpEventParticipant[];
}

export interface EcfmpEventParticipant {
  cid: string;
  origin: string | null;
  destination: string | null;
}

export interface EcfmpFir {
  id: number;
  identifier: string;
  name: string;
}
