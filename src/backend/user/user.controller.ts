import { Controller, Delete, Get, Param } from '@nestjs/common';

import { joiPipeMongoId } from '../database.module';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Get('/')
  getAllPilots() {
    return this.userService.getAllUsers(); 
  }

  @Get('/:userid')
  getPilot(@Param('userid', joiPipeMongoId) userid: string) {
    return this.userService.getUserFromId(userid);
  }

  @Delete('/:userid')
  deletePilot(@Param('userid', joiPipeMongoId) userid: string) {
    return this.userService.deleteUser(userid);
  }
}
