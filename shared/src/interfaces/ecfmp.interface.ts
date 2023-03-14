export interface EcfmpPlugin {
  events: EcfmpEvent[];
  flight_information_regions: EcfmpFir[];
  flow_measures: EcfmpMeasure[];
}

export interface EcfmpMeasure {
  id: number;
  ident: string;
  event_id: number;
  reason: string;
  starttime: string;
  endtime: string;
  withdrawn_at: string | null;
  notified_flight_information_regions: number[];
  measure: EcfmpMeasureAction;
  filters: EcfmpFilter[];
}

export interface EcfmpMeasureAction {
  type: string;
  value: number;
}

export type EcfmpFilter = {
  type: "ADEP" | "ADES" | "waypoint",
  value: string[]
} | {
  type: "level_above" | "level_below",
  value: number
} | {
  type: "level",
  value: number[]
} | {
  type: "member_event" | "member_not_event",
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
