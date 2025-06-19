import axios from 'axios';

import Pilot from '@/shared/interfaces/pilot.interface';

async function getPilots(): Promise<Pilot[]> {
  try {
    const response = await axios.get<{ count: number; pilots: Pilot[] }>('/api/v1/pilots');
    return response.data.pilots;
  } catch (error) {
    throw new Error(`Failed to fetch pilots: ${error}`);
  }
}

async function getPilot(callsign: string | undefined): Promise<Pilot> {
  try {
    if (!callsign || callsign === '') {
      throw new Error('Callsign must be no empty string!');
    }
    const response = await axios.get('/api/v1/pilots/' + callsign);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch pilot: ${error}`);
  }
}

export default {
  getPilots,
  getPilot,
};
