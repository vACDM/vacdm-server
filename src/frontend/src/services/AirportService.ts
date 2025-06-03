import axios from 'axios';

import Airport from '../../../shared/interfaces/airport.interface';

async function getAirports(): Promise<Airport[]> {
  try {
    const response = await axios.get<{ count: number; airports: Airport[]; }>('/api/v1/airports');
    return response.data.airports;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getAirport(icao: string): Promise<Airport> {
  try {
    const response = await axios.get<Airport>('/api/v1/airports/' + icao);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateAirport(icao: string, body: object): Promise<void> {
  try {
    await axios.patch('/api/v1/airports/' + icao, body);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createAirport(body: object): Promise<Airport> {
  try {
    const response = await axios.post<Airport>('/api/v1/airports/', body);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default {
  getAirports,
  getAirport,
  updateAirport,
  createAirport,
};
