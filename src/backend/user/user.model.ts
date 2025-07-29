import mongoose, { HydratedDocument, Model } from 'mongoose';

import getAppConfig from '../config';
import { DB_PROVIDER } from '../database.module';
import logger from '../logger';

import User from '@/shared/interfaces/user.interface';

export const USER_MODEL = 'USER_MODEL';
export type UserModel = Model<User>;
export type UserDocument = HydratedDocument<User>;

const { admins } = getAppConfig();

logger.debug('admins: %o', admins);

const UserSchema = new mongoose.Schema<User>({
  cid: { type: Number, unique: true },

  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },

  // admin: { type: Boolean, default: false },
  hasAtcRating: { type: Boolean, default: false },
  banned: { type: Boolean, default: false },

  roles: [{ type: String }],
}, { timestamps: true, toJSON: { virtuals: ['admin'] }, toObject: { virtuals: ['admin'] } });

UserSchema.virtual('admin').get(function (this: UserDocument) { return !!admins[this.cid]; });

export const UserProvider = {
  provide: USER_MODEL,
  useFactory: (connection: typeof mongoose) => connection.model('User', UserSchema),
  inject: [DB_PROVIDER],
};
