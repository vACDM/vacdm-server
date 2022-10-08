import axios from "axios";

export async function getAirportBlocks(icao: string | undefined) {
  try {
    const blocks = await axios.get('/api/v1/airports/' + icao?.toUpperCase() + '/blocks');

    return blocks.data;
  } catch (error) {
    throw error;
  }
}

export default { getAirportBlocks };