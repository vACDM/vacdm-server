import { Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';
import Joi from 'joi';
import { JoiPipe } from 'nestjs-joi';

import logger from '../logger';
import { UserDocument } from '../user/user.model';

import { User } from './auth.decorator';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

export const COOKIE_NAME_VACDM_TOKEN = 'vacdm_token';

@ApiExcludeController()
@Controller('/api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Get()
  initializeConnectFlow(@Res() res: Response, @Query('state') state: string | undefined) {
    const url = this.authService.getVatsimConnectUrl(state);
    
    res.redirect(url);
  }

  @Get('/callback')
  async vatsimConnectCallback(@Res() res: Response, @Query('code', new JoiPipe(Joi.string())) code: string, @Query('state') state: string, @Query('message', new JoiPipe(Joi.string())) message: string) {
    if (!code && message) {
      return res.redirect('/auth-failure');
    }
    
    const { token, user } = await this.authService.processConnectCallback(code);

    logger.debug('user login (%s) %o', state, user);

    res.cookie(COOKIE_NAME_VACDM_TOKEN, token);

    if (state) {
      // TODO: we need some sort of validation here - it mustn't be an external url
      return res.redirect(state);
    }

    res.redirect('/');
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  getProfile(@User() user: UserDocument) {
    return user;
  }

  @Post('/logout')
  killSession(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_NAME_VACDM_TOKEN);

    return true;
  }
}
