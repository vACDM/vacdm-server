import axios from "axios";

export async function getVersion(): Promise<{}> {
  try {
    const version = await axios.get<{}>(
      "/api/v1/version"
    );

    return version.data;
  } catch (error) {
    throw error;
  }
}

export default { getVersion };
