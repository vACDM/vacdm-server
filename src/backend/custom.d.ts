import User from '@/shared/interfaces/user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
