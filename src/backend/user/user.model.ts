import mongoose, { HydratedDocument, Model } from 'mongoose';

import { DB_PROVIDER } from '../database.module';

import User from '@/shared/interfaces/user.interface';

export const USER_MODEL = 'USER_MODEL';
export type UserModel = Model<User>;
export type UserDocument = HydratedDocument<User>;

const UserSchema = new mongoose.Schema<User>({
  cid: { type: Number, unique: true },

  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },

  admin: { type: Boolean, default: false },
  hasAtcRating: { type: Boolean, default: false },
  banned: { type: Boolean, default: false },

  roles: [{ type: String }],
}, { timestamps: true });

export const UserProvider = {
  provide: USER_MODEL,
  useFactory: (connection: mongoose.Connection) => connection.model('User', UserSchema),
  inject: [DB_PROVIDER],
};
