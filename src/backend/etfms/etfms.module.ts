import { Module } from '@nestjs/common';

import { EcfmpModule } from '../ecfmp/ecfmp.module';
import { PilotModule } from '../pilot/pilot.module';
import { ScheduleModule } from '../schedule.module';

import { EtfmsService } from './etfms.service';

@Module({
  imports: [ScheduleModule, EcfmpModule, PilotModule],
  providers: [EtfmsService],
  exports: [EtfmsService],
})
export class EtfmsModule {}
