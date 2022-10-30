export interface FrontendSettings {
  serverName: string;
  vatsimAuthUrl: string;
  vatsimAuthClientId: string;
}

export interface PluginSettings {
  serverName: string;
  allowSimSession: boolean;
  allowObsMaster: boolean;
}
