import { Injectable } from '@nestjs/common';
import axios from 'axios';

import getAppConfig from '../config';
import { UserService } from '../user/user.service';

import { VatsimConnectUserResponse, VatsimConnectUserResponseData } from '@/shared/interfaces/vatsim.interface';

@Injectable()
export class VatsimConnectService {
  constructor(
    private userService: UserService,
  ) {}

  private authCallbackUrl() {
    const { publicUrl } = getAppConfig();
    return `${publicUrl}/api/vatsim-connect/callback`;
  }

  getVatsimConnectUrl(state: string | void) {
    const { clientId, vatsimAuthUrl } = getAppConfig();

    const params = [
      `client_id=${clientId}`,
      `redirect_uri=${this.authCallbackUrl()}`,
      'response_type=code',
      'scope=full_name+vatsim_details',
      'required_scopes=full_name+vatsim_details',
      'approval_prompt=auto',
    ];

    if (state) {
      params.push(`state=${state}`);
    }

    return `${vatsimAuthUrl}/oauth/authorize?${params.join('&')}`;
  }

  private async exchangeCodeForUserDetails(code: string): Promise<VatsimConnectUserResponseData> {
    const { clientId, clientSecret, vatsimAuthUrl } = getAppConfig();

    const body = {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: this.authCallbackUrl(),
      code: code,
    };

    const tokenResponse = await axios.post(`${vatsimAuthUrl}/oauth/token`, body);

    const userResponse = await axios.get<VatsimConnectUserResponse>(`${vatsimAuthUrl}/api/user`, {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
        Accept: 'application/json',
      },
    });

    return userResponse.data.data;
  }

  async processConnectCallback(code: string) {
    const userData = await this.exchangeCodeForUserDetails(code);

    const user = await this.userService.upsertUser(userData);

    const token = this.userService.createTokenForUser(user);

    return {
      user,
      token,
    };
  }
}
