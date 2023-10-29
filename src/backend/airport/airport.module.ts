import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database.module';

import { AirportController } from './airport.controller';
import { AirportProvider } from './airport.model';
import { AirportService } from './airport.service';

@Module({
  imports: [DatabaseModule],
  providers: [AirportService, AirportProvider],
  controllers: [AirportController],
})
export class AirportModule {}
