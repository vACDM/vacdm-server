import { APIError } from '@shared/errors';
import { NextFunction, Request, Response } from 'express';
import authService from '../services/auth.service';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let vacdmToken = `${req?.cookies?.vacdm_token}`;

  if (!vacdmToken) {
    return next(new APIError('token cookie must be set!', null, 400));
  }

  try {
    req.user = await authService.getUserFromToken(vacdmToken);
  } catch (error) {
    return next(new APIError('Unauthorized', null, 401));
  }

  next();
}

export default authMiddleware;
