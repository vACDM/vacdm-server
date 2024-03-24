import axios from 'axios';

async function getOwnTokens() {
  const tokens = await axios.get('/api/plugin-token');

  return tokens.data;
}
async function revokeToken(id: string) {
  const tokens = await axios.delete(`/api/plugin-token/${id}`);

  return tokens.data;
}

export default {
  getOwnTokens,
  revokeToken,
};
