import { Module } from '@nestjs/common';

import { CdmModule } from '../cdm/cdm.module';
import { EcfmpModule } from '../ecfmp/ecfmp.module';
import { PilotModule } from '../pilot/pilot.module';
import { ScheduleModule } from '../schedule.module';
import { UtilsModule } from '../utils/utils.module';

import { EtfmsService } from './etfms.service';

@Module({
  imports: [ScheduleModule, EcfmpModule, PilotModule, UtilsModule, CdmModule],
  providers: [EtfmsService],
  exports: [EtfmsService],
})
export class EtfmsModule {}
