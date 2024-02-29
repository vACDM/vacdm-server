export interface VatsimDatafeed {
  general: {
    version: number;
    reload: number;
    update: string;
    update_timestamp: string;
    connected_clients: number;
    unique_users: number;
  };

  pilots: VatsimPilot[];
  controllers: VatsimController[];
  atis: VatsimAtis[];
  servers: VatsimServer[];
  prefiles: VatsimPrefile[];
  facilities: VatsimFacilityRating[];
  ratings: VatsimFacilityRating[];
  pilot_ratings: VatsimPilotRating[];
}

export interface VatsimPilot {
  cid: number;
  name: string;
  callsign: string;
  server: string;
  pilot_rating: number;
  latitude: number;
  longitude: number;
  altitude: number;
  groundspeed: number;
  transponder: string;
  heading: number;
  qnh_i_hg: number;
  qnh_mb: 1013;
  flight_plan: VatsimFlightplan;
  logon_time: string;
  last_updated: string;
}

export interface VatsimFlightplan {
  flight_rules: 'I' | 'V';
  aircraft: string;
  aircraft_faa: string;
  aircraft_short: string;
  departure: string;
  arrival: string;
  alternate: string;
  cruise_tas: string;
  altitude: string;
  deptime: string;
  enroute_time: string;
  fuel_time: string;
  remarks: string;
  route: string;
  revision_id: number;
  assigned_transponder: string;
}

export interface VatsimController {
  cid: number;
  name: string;
  callsign: string;
  frequency: string;
  facility: number;
  rating: number;
  server: string;
  visual_range: number;
  text_atis: string[];
  last_updated: string;
  logon: string;
}

export interface VatsimAtis extends VatsimController {
  atis_code: string;
}

export interface VatsimServer {
  ident: string;
  hostname_or_ip: string;
  location: string;
  name: string;
  clients_connection_allowed: number;
  client_connections_allowed: boolean;
  is_sweatbox: boolean;
}

export interface VatsimPrefile {
  cid: string;
  name: string;
  callsign: string;
  flight_plan: VatsimFlightplan;
  last_updated: string;
}

export interface VatsimFacilityRating {
  id: number;
  short: string;
  long: string;
}

export interface VatsimPilotRating {
  id: number;
  short_name: string;
  long_name: string;
}

export interface VatsimDivision {
  id: string;
  name: string;
}

export interface VatsimConnectUserResponseData {
  cid: number;

  personal: {
    name_first: string;
    name_last: string;
    name_full: string;
  }

  vatsim: {
    rating: VatsimFacilityRating;
    pilotrating: VatsimPilotRating;
    division: VatsimDivision;
    region: VatsimDivision;
    subdivision: VatsimDivision;
  }
}
  
export interface VatsimConnectUserResponse {
  data: VatsimConnectUserResponseData
}
