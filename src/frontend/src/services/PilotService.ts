import axios from 'axios';

import Pilot, { PilotLog } from '@/shared/interfaces/pilot.interface';

async function getPilots(): Promise<Pilot[]> {
  try {
    const response = await axios.get<{ count: number; pilots: Pilot[] }>('/api/v1/pilots');
    return response.data.pilots;
  } catch (error) {
    console.error(error);
    throw error;
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
    console.error(error);
    throw error;
  }
}

async function getPilotLogs(callsign: string | undefined): Promise<PilotLog[]> {
  try {
    if (!callsign || callsign === '') {
      throw new Error('Callsign must be no empty string!');
    }
    const response = await axios.get('/api/v1/pilots/' + callsign + '/logs');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default {
  getPilots,
  getPilot,
  getPilotLogs,
};
