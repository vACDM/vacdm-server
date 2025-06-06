import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { ScheduleService } from './schedule.service';

@Module({
  imports: [DiscoveryModule],
  providers: [ScheduleService],
})
export class ScheduleModule {}
