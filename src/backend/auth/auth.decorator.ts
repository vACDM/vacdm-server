import { ExecutionContext, SetMetadata, UseGuards, applyDecorators, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { UserDocument } from '../user/user.model';

import { AuthGuard } from './auth.guard';

export type AcceptedUserTypes = 'web' | 'plugin' | 'any';

export function Auth(usertype: AcceptedUserTypes = 'any') {
  return applyDecorators(
    SetMetadata('usertype', usertype),
    UseGuards(AuthGuard),
  );
}

export const User = createParamDecorator<AcceptedUserTypes | undefined>(
  function getRequestUserDecorator(data: AcceptedUserTypes | undefined, ctx: ExecutionContext): UserDocument | undefined {
    const request = ctx.switchToHttp().getRequest<Request>();
    
    if (data === 'web') {
      return request.webUser;
    }
    if (data === 'plugin') {
      return request.pluginUser;
    }
    
    return request.user || request.webUser || request.pluginUser;
  },
);
