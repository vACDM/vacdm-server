import Joi from 'joi';

import { VacdmAppConfig } from '@/shared/interfaces/config.interface';

interface VacdmConfigEnv {
  MONGO_URI: string;
  
  SERVER_NAME: string;
  
  VATSIM_AUTH_URL: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  
  PORT: number;
  
  ALLOW_SIM: string | void;
  ALLOW_OBS_MASTER: string | void;
  
  TIME_LAST_SEEN: number;
  TIME_INACTIVE: number;
  TIME_LAST_LOGIN: number;
  
  LOG_LEVEL_CONSOLE: string;
  LOG_LEVEL_FILE: string;
  
  EVENT_URL: string | void;
  EVENT_PRIO: string;
  EVENT_PULL_INTERVAL: string;
  
  PUBLIC_URL: string;
  JWT_SECRET: string;
  FRONTEND_PROXY: string | void;
}

const configValidationResult = Joi.object<VacdmConfigEnv>({
  MONGO_URI: Joi.string().required(),

  SERVER_NAME: Joi.string().default('vACDM Server'),

  VATSIM_AUTH_URL: Joi.string().default('https://auth.vatsim.net'),
  CLIENT_ID: Joi.string().required(),
  CLIENT_SECRET: Joi.string().required(),

  PORT: Joi.number().default(3000),

  ALLOW_SIM: Joi.string().optional(),
  ALLOW_OBS_MASTER: Joi.string().optional(),

  // TODO: maybe use timestring module?
  TIME_LAST_SEEN: Joi.number().default(5),
  TIME_INACTIVE: Joi.number().default(5),
  TIME_LAST_LOGIN: Joi.number().default(48),

  LOG_LEVEL_CONSOLE: Joi.string().default('http'),
  LOG_LEVEL_FILE: Joi.string().default('info'),

  EVENT_URL: Joi.string().optional(),
  EVENT_PRIO: Joi.string().default(5),
  EVENT_PULL_INTERVAL: Joi.string().default(5),

  PUBLIC_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().default('super-secret-secret'),
  FRONTEND_PROXY: Joi.string().optional(),
}).unknown(true).validate(process.env);
const validatedEnv: VacdmConfigEnv = configValidationResult.value;

if (configValidationResult.error) {
  // eslint-disable-next-line no-console
  console.error(`\x1b[30;41mFailed to start Application: \x1b[35;37m${configValidationResult.error.message}\x1b[0m`);
  throw configValidationResult.error;
}

export default function getAppConfig(): VacdmAppConfig {
  const options = {
    serverName: validatedEnv.SERVER_NAME ?? 'vACDM Server',
    vatsimAuthUrl: validatedEnv.VATSIM_AUTH_URL ?? 'https://auth.vatsim.net',
    vatsimAuthClientId: validatedEnv.CLIENT_ID ?? '',
  };

  return {
    mongoUri: validatedEnv.MONGO_URI,
    port: validatedEnv.PORT,

    pluginSettings: {
      serverName: options.serverName,
      allowSimSession: validatedEnv.ALLOW_SIM == 'true' ?? false,
      allowObsMaster: validatedEnv.ALLOW_OBS_MASTER == 'true' ?? false,
    },

    frontendSettings: {
      serverName: options.serverName,
      vatsimAuthUrl: options.vatsimAuthUrl,
      vatsimAuthClientId: options.vatsimAuthClientId,
    },

    timeframes: {
      timeSinceLastSeen: Number(validatedEnv.TIME_LAST_SEEN || 5) * 60 * 1000,
      timeSinceInactive: Number(validatedEnv.TIME_INACTIVE || 5) * 60 * 1000,
      timeSinceLastLogin: Number(validatedEnv.TIME_LAST_LOGIN || 48) * 60 * 60 * 1000,
    },

    logging: {
      levelConsole: validatedEnv.LOG_LEVEL_CONSOLE || 'http',
      levelFile: validatedEnv.LOG_LEVEL_FILE || 'info',
    },

    eventUrl: validatedEnv.EVENT_URL || 'https://slots.vatsim-germany.org/api/events/',
    eventPrio: Number(validatedEnv.EVENT_PRIO) || 5,
    eventPullInterval: Number(validatedEnv.EVENT_PULL_INTERVAL || 5),

    vatsimAuthUrl: options.vatsimAuthUrl,
    clientId: options.vatsimAuthClientId,
    clientSecret: validatedEnv.CLIENT_SECRET ?? '',

    publicUrl: validatedEnv.PUBLIC_URL ?? '',
    jwtSecret: validatedEnv.JWT_SECRET ?? 'super-secret-secret!',

    frontendProxy: validatedEnv.FRONTEND_PROXY ?? '',
  };
}
