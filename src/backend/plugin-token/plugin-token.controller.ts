import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';

import { User } from '../auth/auth.decorator';
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

  @Get('/authorize/:id')
  async authorizePluginToken(@Param('id') id: string, @Res() res: Response, @User() user: UserDocument) {
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

  @Post('/poll/:id')
  async pollingPluginToken(@Param('id') id: string, @Body('secret') pollingSecret: string) {
    logger.debug('id: %s, pollingSecret: %s', id, pollingSecret);
    return {};
  }
}
