import {
  FrontendSettings,
  PluginSettings,
} from '@shared/interfaces/config.interface';

interface vacdmConfig {
  mongoUri: string;
  port: number;
  role: 'API' | 'WORKER';

  pluginSettings: PluginSettings;
  frontendSettings: FrontendSettings;

  timeframes: {
    timeSinceLastSeen: number;
    timeSinceInactive: number;
  };

  clientId: string;
  clientSecret: string;
  publicUrl: string;
  vatsimAuthUrl: string;
  jwtSecret: string;
}

export default function config(): vacdmConfig {
  const options = {
    serverName: process.env.SERVER_NAME ?? 'vACDM Server',
    vatsimAuthUrl: process.env.VATSIM_AUTH_URL ?? 'https://auth.vatsim.net',
    vatsimAuthClientId: process.env.CLIENT_ID ?? '',
  };

  return {
    mongoUri: process.env.MONGO_URI || '',
    port: Number(process.env.PORT) || 3000,
    role: process.env.ROLE != 'WORKER' ? 'API' : 'WORKER',

    pluginSettings: {
      serverName: options.serverName,
      allowSimSession: process.env.ALLOW_SIM == 'true' ?? false,
      allowObsMaster: process.env.ALLOW_OBS_MASTER == 'true' ?? false,
    },

    frontendSettings: {
      serverName: options.serverName,
      vatsimAuthUrl: options.vatsimAuthUrl,
      vatsimAuthClientId: options.vatsimAuthClientId,
    },

    timeframes: {
      timeSinceLastSeen: 15 * 60 * 1000,
      timeSinceInactive: 15 * 60 * 1000,
    },

    vatsimAuthUrl: options.vatsimAuthUrl,
    clientId: options.vatsimAuthClientId,
    clientSecret: process.env.CLIENT_SECRET ?? '',

    publicUrl: process.env.PUBLIC_URL ?? '',
    jwtSecret: process.env.JWT_SECRET ?? 'super-secret-secret!',
  };
}
