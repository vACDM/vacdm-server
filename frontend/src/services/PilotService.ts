import Pilot from '@shared/interfaces/pilot.interface';
import axios from 'axios'


async function getPilots(): Promise<Pilot[]> {
    try {
      const response = await axios.get<Pilot[]>('https://vacdm.dotfionn.de/api/v1/pilots');
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function getPilot(callsign: string | undefined, debug?: boolean): Promise<Pilot> {
    try {
      if (!callsign || callsign === '') {
        throw new Error ('Callsign must be no empty string!')
      }
      const response = await axios.get('/api/v1/pilots/' + callsign + (debug ?  '?debug' : ''));
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

/* function pilotAdapter(inVal: Object): Pilot {
  
  return {
    //...
  }
} */



export default {
  getPilots,
  getPilot
}




