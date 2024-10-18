import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { joiPipeMongoId } from '../database.module';

import { UserService } from './user.service';

@ApiTags('users')
@Controller('api/v1/users')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Get('/')
  async getAllUsers() {
    const users = await this.userService.getAllUsers();

    return {
      count: users.length,
      users: users,
    };
  }

  @Get('/:userid')
  getUser(@Param('userid', joiPipeMongoId) userid: string) {
    return this.userService.getUserFromId(userid);
  }

  @Delete('/:userid')
  deleteUser(@Param('userid', joiPipeMongoId) userid: string) {
    return this.userService.deleteUser(userid);
  }
}
