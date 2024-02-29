import axios from 'axios';

import config from '../config';

type VaccAuthData = {
  cid: string;
};

export async function vaccAuthUrl(cid: string): Promise<boolean> {
  try {
    const vaccAuthResponse = await axios.get(config().vaccAuthUrl, {
      headers: {
        Authorization: 'Bearer ' + config().vaccAuthToken,
      },
      params: {
        vatsimid: cid,
      },
    });
    return vaccAuthResponse.status == 200;
  } catch (err) {
    return false;
  }
}

export async function vaccAuth(authData: VaccAuthData): Promise<boolean> {
  switch (config().vaccAuthType) {
    case 'URL':
      return vaccAuthUrl(authData.cid);
    default:
      return false;
  }
}
