export default function config() {
  return {
    mongoUri: process.env.MONGO_URI || '',
    port: Number(process.env.PORT) || 3000,
  };
}
