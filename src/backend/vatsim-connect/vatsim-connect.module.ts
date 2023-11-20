import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { VatsimConnectController } from './vatsim-connect.controller';
import { VatsimConnectService } from './vatsim-connect.service';

@Module({
  imports: [UserModule],
  providers: [VatsimConnectService],
  controllers: [VatsimConnectController],
})
export class VatsimConnectModule {}
