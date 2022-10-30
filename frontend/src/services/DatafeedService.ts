import axios from "axios";

export async function getPilotFromCid(cid: number) {
  try {
    const pilot = await axios.get('/api/v1/datafeed/' + cid.toString());
    return pilot.data;
  } catch (error) {
    throw error;
  }
}

export default { getPilotFromCid };
