export default function config() {
  return {
    mongoUri: process.env.MONGO_URI || '',
    port: Number(process.env.PORT) || 3000,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    publicUrl: process.env.PUBLIC_URL,
    vatsimAuthUrl: process.env.VATSIM_AUTH_URL,
    jwtSecret: process.env.JWT_SECRET

  };
}