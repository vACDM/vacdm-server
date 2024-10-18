import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Query, Res, UnauthorizedException } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';
import { FilterQuery } from 'mongoose';

import PluginToken from '../../shared/interfaces/plugin-token.interface';
import { Auth, User } from '../auth/auth.decorator';
import getAppConfig from '../config';
import logger from '../logger';
import { UserDocument } from '../user/user.model';

import { PluginTokenService } from './plugin-token.service';

const { publicUrl } = getAppConfig();

@ApiExcludeController()
@Controller('/api/plugin-token')
export class PluginTokenController {
  constructor(
    private pluginTokenService: PluginTokenService,
  ) {}

  @Post('start')
  async startPluginAuthFlow() {
    const token = await this.pluginTokenService.startPluginAuthFlow();

    return {
      userRedirectUrl: `${publicUrl}/api/plugin-token/authorize/${token._id}`,
      pollingUrl: `${publicUrl}/api/plugin-token/poll/${token._id}`,
      pollingSecret: token.pollingSecret,
    };
  }

  /**
   * Endpoint for user to actually authorize plugin token
   * @param tokenId
   * @param user
   * @returns
   */
  @HttpCode(200)
  @Post('/authorize/:id')
  @Auth('web')
  async authorizePluginToken(@Param('id') tokenId: string, @User() user: UserDocument, @Body('confirm') confirmation: string, @Body('label') label: string) {
    if (!user) {
      throw new UnauthorizedException();
    }

    if (confirmation !== 'yes') {
      throw new BadRequestException();
    }

    const wasAuthorized = await this.pluginTokenService.userAuthorizeToken(user._id, tokenId, label);

    if (!wasAuthorized) {
      throw new NotFoundException();
    }

    return {
      tokenId: tokenId,
      userId: user._id,
    };
  }

  /**
   * Endpoint for plugin to redirect user to, redirects to either frontend or authentication endpoints
   * @param id
   * @param res
   * @param user
   * @returns
   */
  @Get('/authorize/:id')
  async startAuthorizePluginToken(@Param('id') id: string, @Res() res: Response, @User() user: UserDocument) {
    logger.debug('id: %s', id);

    const isFlowValid = await this.pluginTokenService.isFlowIdValid(id);

    if (!isFlowValid) {
      return res.redirect('/authorize-plugin-forbidden');
    }

    const url = `/authorize-plugin/${id}`;

    if (user) {
      return res.redirect(url);
    } else {
      return res.redirect(`/api/auth?state=${encodeURI(url)}`);
    }
  }

  @HttpCode(200)
  @Post('/poll/:id')
  async pollingPluginToken(@Param('id') id: string, @Body('secret') pollingSecret: string) {
    logger.debug('id: %s, pollingSecret: %s', id, pollingSecret);

    const token = await this.pluginTokenService.exchangePollingSecretForToken(id, pollingSecret);

    return {
      ready: !!token,
      token,
    };
  }

  @Get('')
  @Auth('web')
  async getAllTokens(@User() user: UserDocument, @Query('scope') scope = 'own') {
    let filter: FilterQuery<PluginToken> = { user: user._id };

    if (scope == 'all' && user.admin) {
      filter = {};
    }

    const tokens = await this.pluginTokenService.findTokens(filter);

    return tokens;
  }

  @Delete('/:id')
  @Auth('web')
  async revokeToken(@User() user: UserDocument, @Param('id') id: string) {
    const token = await this.pluginTokenService.findToken({ user: user._id, _id: id });

    if (!token) {
      throw new NotFoundException();
    }

    this.pluginTokenService.deleteTokenById(token._id);

    return token;
  }
}
