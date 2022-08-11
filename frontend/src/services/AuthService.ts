import axios from "axios";

export async function getProfile() {
  try {
    const profile = await axios.get("/api/v1/auth/profile", {
      withCredentials: true,
    });

    return profile.data;
  } catch (error) {
    throw error;
  }
}

export default { getProfile };
