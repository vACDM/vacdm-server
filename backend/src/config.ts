interface vacdmConfig {
  mongoUri: string,
  port: number,
  role: "API" | "WORKER",
  pluginSettings: {
    serverName: string,
    allowSimSession: boolean,
    allowObsMaster: boolean
  },

  clientId: string,
  clientSecret: string,
  publicUrl: string,
  vatsimAuthUrl: string,
  jwtSecret: string
}

export default function config(): vacdmConfig {
  return {
    mongoUri: process.env.MONGO_URI || '',
    port: Number(process.env.PORT) || 3000,
    role: process.env.ROLE != "WORKER" ? "API" : "WORKER",
    pluginSettings: {
      serverName: process.env.SERVER_NAME ?? 'vACDM Server',
      allowSimSession: process.env.ALLOW_SIM == 'true' ?? false,
      allowObsMaster: process.env.ALLOW_OBS_MASTER == 'true' ?? false,
    },
    clientId: process.env.CLIENT_ID ?? "",
    clientSecret: process.env.CLIENT_SECRET ?? "",
    publicUrl: process.env.PUBLIC_URL ?? "",
    vatsimAuthUrl: process.env.VATSIM_AUTH_URL ?? "https://auth.vatsim.net",
    jwtSecret: process.env.JWT_SECRET ?? "super-secret-secret!"
  };
}
