import axios from 'axios';

export async function getVersion(): Promise<object> {
  try {
    const version = await axios.get<object>(
      '/api/v1/version',
    );

    return version.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default {
  getVersion,
};
