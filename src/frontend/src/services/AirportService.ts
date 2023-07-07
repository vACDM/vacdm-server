import axios from 'axios';

async function getAirports() {
  try {
    const response = await axios.get('/api/v1/airports');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getAirport(icao: string) {
  try {
    const response = await axios.get('/api/v1/airports/' + icao);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function updateAirport(icao: string, body: object) {
  try {       
    await axios.patch('/api/v1/airports/' + icao, body);
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createAirport(body: object) {
  try {
    const response = await axios.post('/api/v1/airports/', body);
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
