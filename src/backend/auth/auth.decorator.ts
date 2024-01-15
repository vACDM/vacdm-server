import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { UserDocument } from '../user/user.model';

export const User = createParamDecorator(
  function getRequestUserDecorator(data: void, ctx: ExecutionContext): UserDocument {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
