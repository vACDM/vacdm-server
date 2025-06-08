import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { DatabaseModule } from '../database.module';

import { ScheduleProvider } from './schedule.model';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [DiscoveryModule, DatabaseModule],
  providers: [ScheduleService, ScheduleProvider],
})
export class ScheduleModule {}
