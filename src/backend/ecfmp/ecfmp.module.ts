import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database.module';
import { ScheduleModule } from '../schedule.module';

import { EcfmpMeasureProvider } from './ecfmp-measure.model';
import { EcfmpService } from './ecfmp.service';

@Module({
  imports: [DatabaseModule, ScheduleModule],
  providers: [EcfmpService, EcfmpMeasureProvider],
  exports: [EcfmpService],
})
export class EcfmpModule {}
