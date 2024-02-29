export interface VacdmAppConfig {
  mongoUri: string;

  port: number;

  pluginSettings: PluginSettings;
  frontendSettings: FrontendSettings;

  timeframes: {
    timeSinceLastSeen: number;
    timeSinceInactive: number;
    timeSinceLastLogin: number;
  };

  logging: {
    levelConsole: string;
    levelFile: string;
  };

  eventUrl: string;
  eventPrio: number;
  eventPullInterval: number;

  vatsimAuthUrl: string;
  clientId: string;
  clientSecret: string;

  publicUrl: string;
  jwtSecret: string;
  frontendProxy: string;
}

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
