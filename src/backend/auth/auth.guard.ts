import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { AcceptedUserTypes } from './auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const usertype = this.reflector.get<AcceptedUserTypes>('usertype', context.getHandler()) || 'any';

    switch (usertype) {
      case 'web': {
        request.user = request.webUser;
        break;
      }
      case 'plugin': {
        request.user = request.pluginUser;
        break;
      }
      case 'any': {
        request.user = request.webUser || request.pluginUser;
        break;
      }
    }



    return !!request.user;
  }
}
