import { NextFunction, Request, Response, Router } from 'express';

import authMiddleware from '../middleware/auth.middleware';
import authService from '../services/auth.service';

import { UserDocument } from './../models/user.model';

export async function authUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { code } = req.query;
    if (Array.isArray(code) || !code) {
      throw new Error('code must be a string, no array');
    }

    const response = await authService.authUser(code.toString());

    res.cookie('vacdm_token', response, {
      secure: false,
      httpOnly: true,
    });

    const user: UserDocument = await authService.getUserFromToken(response);
    console.log('User is: ', user);

    if (user.vacdm.atc || user.vacdm.admin) {
      return res.redirect('/atc');
    }

    res.redirect('/vdgs/');
  } catch (error) {
    if (error.message == 'something went wrong with auth') {
      return next();
    }

    next(error);
  }
}

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.user) {
    req.user.access_token = '';
    req.user.refresh_token = '';
  }
  res.json(req.user ?? {});
}

export async function logoutUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.clearCookie('vacdm_token');
  res.json({ success: true });
}

const router = Router()
  .get('/login', authUser)
  .get('/logout', logoutUser)
  .get('/profile', authMiddleware, getProfile);

export default {
  router,
};
