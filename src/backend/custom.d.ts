import { UserDocument } from './user/user.model';

declare global {
  namespace Express {
    interface Request {
      webUser?: UserDocument;
      pluginUser?: UserDocument;
      user?: UserDocument;
    }
  }
}
