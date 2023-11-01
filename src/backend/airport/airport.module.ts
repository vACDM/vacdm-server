import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database.module';
import { UtilsModule } from '../utils/utils.module';

import { AirportController } from './airport.controller';
import { AirportProvider } from './airport.model';
import { AirportService } from './airport.service';

@Module({
  imports: [DatabaseModule, UtilsModule],
  providers: [AirportService, AirportProvider],
  controllers: [AirportController],
})
export class AirportModule {}
