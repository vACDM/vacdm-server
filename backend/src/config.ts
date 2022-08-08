export default function config() {
  return {
    mongoUri: process.env.MONGO_URI || '',
    port: Number(process.env.PORT) || 3000,
    pluginSettings: {
      serverName: process.env.SERVER_NAME ?? 'vACDM Server',
      allowSimSession: process.env.ALLOW_SIM == 'true' ?? false,
      allowObsMaster: process.env.ALLOW_OBS_MASTER == 'true' ?? false,
    },
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    publicUrl: process.env.PUBLIC_URL,
    vatsimAuthUrl: process.env.VATSIM_AUTH_URL,
    jwtSecret: process.env.JWT_SECRET

  };
}
