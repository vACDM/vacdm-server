import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UserService } from '../user/user.service';

import { COOKIE_NAME_VACDM_TOKEN } from './auth.controller';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const token = request.cookies[COOKIE_NAME_VACDM_TOKEN];

    if (!token) return next();

    try {  
      request.user = await this.userService.getUserFromToken(token);
    } catch (_) {
      // do nothing
    }

    next();
  }
}
