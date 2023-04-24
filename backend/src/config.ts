import { FrontendSettings, PluginSettings } from '@shared/interfaces/config.interface';

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

  eventUrl: string;
  eventPrio: number;
  eventPullInterval: number;

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
    vaccLogoUrl: process.env.VACC_LOGO_URL ?? '',
    vaccImprintUrl: process.env.VACC_IMPRINT_URL ?? '',
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
      vaccLogoUrl: options.vaccLogoUrl,
      vaccImprintUrl: options.vaccImprintUrl,
    },

    timeframes: {
      timeSinceLastSeen: Number(process.env.TIME_LAST_SEEN || 5) * 60 * 1000,
      timeSinceInactive: Number(process.env.TIME_INACTIVE || 5) * 60 * 1000,
    },

    eventUrl: process.env.EVENT_URL || 'https://slots.vatsim-germany.org/api/events/',
    eventPrio: Number(process.env.EVENT_PRIO) || 5,
    eventPullInterval: Number(process.env.EVENT_PULL_INTERVAL || 5),

    vatsimAuthUrl: options.vatsimAuthUrl,
    clientId: options.vatsimAuthClientId,
    clientSecret: process.env.CLIENT_SECRET ?? '',

    publicUrl: process.env.PUBLIC_URL ?? '',
    jwtSecret: process.env.JWT_SECRET ?? 'super-secret-secret!',
  };
}
