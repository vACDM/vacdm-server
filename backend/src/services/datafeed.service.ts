import axios from 'axios';
import * as VatsimTypes from '@shared/interfaces/vatsim.interface';

export async function getRawDatafeed(): Promise<VatsimTypes.VatsimDatafeed> {
  try {
    const response = await axios.get<VatsimTypes.VatsimDatafeed>(
      'https://data.vatsim.net/v3/vatsim-data.json'
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getFlight(
  callsign: string
): Promise<VatsimTypes.VatsimPilot> {
  try {
    const datafeed = await getRawDatafeed();

    const pilot = datafeed.pilots.find((p) => p.callsign == callsign);

    if (!pilot) {
      throw new Error('requested flight not online');
    }

    return pilot;
  } catch (error) {
    throw error;
  }
}

export async function getFlightByCid(
  cid: number
): Promise<VatsimTypes.VatsimPilot> {
  try {
    const datafeed = await getRawDatafeed();

    const pilot = datafeed.pilots.find((p) => p.cid == cid);

    if (!pilot) {
      throw new Error('requested Cid not found');
    }

    return pilot;
  } catch (error) {
    throw error;
  }
}

export default { getRawDatafeed, getFlight, getFlightByCid };
