import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database.module';
import { PilotModule } from '../pilot/pilot.module';
import { UtilsModule } from '../utils/utils.module';

import { AirportController } from './airport.controller';
import { AirportProvider } from './airport.model';
import { AirportService } from './airport.service';

@Module({
  imports: [DatabaseModule, UtilsModule, PilotModule],
  providers: [AirportService, AirportProvider],
  controllers: [AirportController],
  exports: [AirportService],
})
export class AirportModule {}
