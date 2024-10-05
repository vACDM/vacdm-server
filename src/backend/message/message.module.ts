import { Module } from '@nestjs/common';

import { CdmModule } from '../cdm/cdm.module';
import { PilotModule } from '../pilot/pilot.module';
import { UtilsModule } from '../utils/utils.module';

import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  providers: [MessageService],
  controllers: [MessageController],
  imports: [PilotModule, CdmModule, UtilsModule],
})
export class MessageModule {}
