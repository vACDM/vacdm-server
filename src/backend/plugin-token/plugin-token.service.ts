import { Inject, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

import { UtilsService } from '../utils/utils.service';

import { PLUGINTOKEN_MODEL, PluginTokenDocument, PluginTokenModel } from './plugin-token.model';

@Injectable()
export class PluginTokenService {
  constructor(
    private utilsService: UtilsService,
    @Inject(PLUGINTOKEN_MODEL) private pluginTokenModel: PluginTokenModel,
  ) {}

  /**
   * start new authentication flow for plugin auth
   * @returns new plugin token document
   */
  async startPluginAuthFlow(): Promise<PluginTokenDocument> {
    const token = await this.pluginTokenModel.create({
      token: this.utilsService.generateRandomBytes(),
      pollingSecret: this.utilsService.generateRandomBytes(),
    });

    return token;
  }

  /**
   * exchange pollingsecret for token, once user has finished authentication and consent
   * @param pollingSecret pollingsecret provided by plugin
   * @returns token or undefined if pollingsecret not valid
   */
  async exchangePollingSecretForToken(id: string, pollingSecret: string): Promise<string | undefined> {
    const pluginToken = await this.pluginTokenModel.findOneAndUpdate({
      _id: id,
      pollingSecret,
      user: { $not: { $eq: null } },
    }, {
      $set: {
        pollingSecret: null,
      },
    });

    return pluginToken?.token;
  }

  /**
   * get user id from token
   * @param token token for plugin authentication
   * @returns user id if token is valid, undefined otherwise
   */
  async attemptPluginAuthentication(token: string): Promise<string | undefined> {
    const pluginToken = await this.pluginTokenModel.findOneAndUpdate({
      token,
      pollingSecret: null,
    }, {
      $set: {
        lastUsed: Date.now(),
      },
    });

    return pluginToken?.user;
  }

  async userAuthorizeToken(userId: string | mongoose.Types.ObjectId, tokenId: string, label = 'Token'): Promise<boolean> {
    const pluginToken = await this.pluginTokenModel.findOneAndUpdate({
      _id: tokenId,
    }, {
      $set: {
        user: userId,
        label,
      },
    });

    return !!pluginToken;
  }

  async isFlowIdValid(id: string): Promise<boolean> {
    const count = await this.pluginTokenModel.count({ _id: id });

    return count > 0;
  }
}
