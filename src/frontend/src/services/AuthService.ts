import axios from 'axios';

export async function getProfile() {
  try {
    const profile = await axios.get('/api/v1/auth/profile', {
      withCredentials: true,
    });

    return profile.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getConfig() {
  try {
    const config = await axios.get('/api/v1/config/frontend', {});

    return config.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function logout() {
  try {
    await axios.get('/api/v1/auth/logout', {
      withCredentials: true,
    });
    
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default { getProfile, getConfig, logout };
