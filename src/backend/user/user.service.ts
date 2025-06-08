import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { FilterQuery } from 'mongoose';

import getAppConfig from '../config';
import logger from '../logger';
import { PluginTokenService } from '../plugin-token/plugin-token.service';
import { Schedule } from '../schedule/schedule.decorator';

import { USER_MODEL, UserDocument, UserModel } from './user.model';

import User from '@/shared/interfaces/user.interface';
import { VatsimConnectUserResponseData } from '@/shared/interfaces/vatsim.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_MODEL) private userModel: UserModel,
    private pluginTokenService: PluginTokenService,
  ) {
  }

  getUsers(filter: FilterQuery<User>): Promise<UserDocument[]> {
    return this.userModel.find(filter).exec();
  }

  getAllUsers(): Promise<UserDocument[]> {
    return this.getUsers({});
  }

  async getUserFromId(id: string): Promise<UserDocument> {
    logger.silly('trying to get a user with id "%s"', id);
    const user = await this.userModel.findById(id);

    if (!user) {
      logger.verbose('could not find user with id "%s"', id);
      throw new NotFoundException();
    }

    return user;
  }

  async getUserFromCid(cid: number): Promise<UserDocument> {
    logger.silly('trying to get a user with cid "%s"', cid);
    const user = await this.userModel.findOne({ cid });

    if (!user) {
      logger.verbose('could not find user with id "%s"', cid);
      throw new NotFoundException();
    }

    return user;
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

  getUserFromToken(token: string): Promise<UserDocument> {
    const { jwtSecret } = getAppConfig();

    const tokenData = jwt.verify(token, jwtSecret);

    if (typeof tokenData != 'object') {
      logger.warn('somehow tokendata was not object, how tf can this happen? :O %o', tokenData);
      throw new Error('something weird happened');
    }

    return this.getUserFromCid(tokenData.cid);
  }

  async getUserFromPluginToken(token: string): Promise<UserDocument> {
    const userId = await this.pluginTokenService.attemptPluginAuthentication(token);

    if (typeof userId === 'undefined') {
      throw new NotFoundException();
    }

    const user = await this.getUserFromId(userId);

    return user;
  }

  @Schedule({ interval: '10 minutes' })
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

  async deleteUser(id: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
