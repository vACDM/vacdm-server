import { Module, forwardRef } from '@nestjs/common';

import { DatabaseModule } from '../database.module';
import { NatsModule } from '../nats/nats.module';
import { PilotModule } from '../pilot/pilot.module';
import { UtilsModule } from '../utils/utils.module';

import { AirportController } from './airport.controller';
import { AirportMessageHandler } from './airport.messagehandler';
import { AirportProvider } from './airport.model';
import { AirportService } from './airport.service';

@Module({
  imports: [
    DatabaseModule,
    UtilsModule,
    forwardRef(() => PilotModule),
    NatsModule,
  ],
  providers: [AirportService, AirportProvider],
  controllers: [AirportController, AirportMessageHandler],
  exports: [AirportService],
})
export class AirportModule {}
