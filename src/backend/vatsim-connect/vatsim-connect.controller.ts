import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import Joi from 'joi';
import { JoiPipe } from 'nestjs-joi';

import logger from '../logger';

import { VatsimConnectService } from './vatsim-connect.service';

@Controller('/api/vatsim-connect')
export class VatsimConnectController {
  constructor(
    private vatsimConnectService: VatsimConnectService,
  ) {}

  @Get()
  initializeConnectFlow(@Res() res: Response, @Query('state') state: string | undefined) {
    const url = this.vatsimConnectService.getVatsimConnectUrl(state);
    
    res.redirect(url);
  }

  @Get('/callback')
  async vatsimConnectCallback(@Res() res: Response, @Query('code', new JoiPipe(Joi.string())) code: string, @Query('state') state: string, @Query('message', new JoiPipe(Joi.string())) message: string) {
    if (!code && message) {
      return res.redirect('/auth-failure');
    }
    
    const { token, user } = await this.vatsimConnectService.processConnectCallback(code);

    logger.debug('user login (%s) %o', state, user);

    res.cookie('vacdm_token', token);

    // if (state) {
    // TODO: redirect to url set in state
    // }

    res.redirect('/');
  }
}
