import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UserService } from '../user/user.service';

import { COOKIE_NAME_VACDM_TOKEN } from './auth.controller';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  private headerTokenRegex = /^Bearer (.+)$/;

  async use(request: Request, response: Response, next: NextFunction) {
    const cookieToken = request.cookies[COOKIE_NAME_VACDM_TOKEN];

    if (cookieToken) {
      try {
        request.webUser = await this.userService.getUserFromToken(cookieToken);

        const newToken = await this.authService.getNewTokenIfOldTokenExpiresSoon(cookieToken);

        if (newToken) {
          response.cookie(COOKIE_NAME_VACDM_TOKEN, newToken);
        }
      } catch (_) {
        // do nothing
      }
    }

    const pluginToken = request.headers.authorization;

    const res = this.headerTokenRegex.exec(pluginToken || '');

    if (res) {
      try {
        request.pluginUser = await this.userService.getUserFromPluginToken(res[1]);
      } catch (_) {
        // do nothing
      }
    }

    next();
  }
}
