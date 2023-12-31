import { Module } from '@nestjs/common';

import { ScheduleModule } from '../schedule.module';
import { DatabaseModule } from '../database.module';

import { UserController } from './user.controller';
import { UserProvider } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule,
  ],
  providers: [UserService, UserProvider],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
