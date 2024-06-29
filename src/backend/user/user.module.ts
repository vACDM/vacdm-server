import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database.module';
import { PluginTokenModule } from '../plugin-token/plugin-token.module';
import { ScheduleModule } from '../schedule.module';

import { UserController } from './user.controller';
import { UserProvider } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule,
    PluginTokenModule,
  ],
  providers: [UserService, UserProvider],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
