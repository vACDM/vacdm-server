import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';

import getAppConfig from '../config';

import { USER_MODEL, UserDocument, UserModel } from './user.model';

import User from '@/shared/interfaces/user.interface';

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
