export interface FrontendSettings {
  serverName: string;
  vatsimAuthUrl: string;
  vatsimAuthClientId: string;
  vaccLogoUrl: string;
  vaccImprintUrl: string;
}

export interface PluginSettings {
  serverName: string;
  allowSimSession: boolean;
  allowObsMaster: boolean;
}
