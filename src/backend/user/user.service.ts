import { Inject, Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { FilterQuery } from 'mongoose';

import getAppConfig from '../config';

import { USER_MODEL, UserDocument, UserModel } from './user.model';

import User from '@/shared/interfaces/user.interface';
import { VatsimConnectUserResponseData } from '@/shared/interfaces/vatsim.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_MODEL) private userModel: UserModel,
  ) {}

  getUsers(filter: FilterQuery<User>): Promise<UserDocument[]> {
    return this.userModel.find(filter).exec();
  }

  getAllUsers(): Promise<UserDocument[]> {
    return this.getUsers({});
  }

  async upsertUser(data: VatsimConnectUserResponseData): Promise<UserDocument> {
    const user = await this.userModel.findOneAndUpdate({
      cid: data.cid,
    }, {
      $set: {
        firstName: data.personal.name_first,
        lastName: data.personal.name_last,
        hasAtcRating: data.vatsim.rating.id >= 2,
      },
    }, {
      new: true,
      upsert: true,
    });

    return user;
  }

  createTokenForUser(user: UserDocument): string {
    const { jwtSecret } = getAppConfig();
    
    return jwt.sign({
      cid: user.cid,
    }, jwtSecret, {
      expiresIn: '1h',
    });
  }

  async cleanupUsers() {
    const inactiveUsers = await this.getUsers({
      admin: false,
      banned: false,
      roles: [],
      updatedAt: {
        $lte: new Date(Date.now() - getAppConfig().timeframes.timeSinceLastLogin).getTime(),
      },
    });

    return Promise.allSettled(inactiveUsers.map(u => u.delete()));
  }
}
