import axios from 'axios';
import config from '../config';

export async function vaccAuth(cid: string): Promise<boolean> {
  switch (config().vaccAuthType) {
    case 'URL':
      return await vaccAuth_URL(cid);
    default:
      return false;
  }
}

export async function vaccAuth_URL(cid: string): Promise<boolean> {
  try {
    const vaccAuthResponse = await axios.get(config().vaccAuthUrl, {
      headers: {
        Authorization: 'Bearer ' + config().vaccAuthToken,
      },
      params: {
        vatsimid: cid,
      },
    });
    if (vaccAuthResponse.status == 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}
