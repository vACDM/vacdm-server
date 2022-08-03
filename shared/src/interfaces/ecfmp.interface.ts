export interface EcfmpMeasure {
  id: number;
  ident: string;
  event_id: number;
  reason: string;
  starttime: string;
  endtime: string;
  notified_flight_information_regions: number[];
  measure: EcfmpMeasureAction;
  filters: EcfmpFilter[];
}

export interface EcfmpMeasureAction {
  type: string;
  value: number;
}

export interface EcfmpFilter {
  type: "ADEP" | "ADES" | "level_above" | "level_below" | "level" | "member_event" | "member_not_event" | "waypoint" | string;
  value: string[] | number[] | number | EcfmpEvent[];
}

export interface EcfmpEvent extends EcfmpFilter {
  event_id: number;
  event_vatcan: string | null;
  event_api: null;
}
