import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database.module';

import { UserProvider } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, UserProvider],
  exports: [UserService],
})
export class UserModule {}
