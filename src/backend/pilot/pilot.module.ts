import { Module, forwardRef } from '@nestjs/common';

import { AgendaModule } from '../agenda.module';
import { AirportModule } from '../airport/airport.module';
import { DatabaseModule } from '../database.module';
import { UtilsModule } from '../utils/utils.module';

import { PilotController } from './pilot.controller';
import { PilotProvider } from './pilot.model';
import { PilotService } from './pilot.service';

@Module({
  imports: [
    DatabaseModule,
    UtilsModule,
    forwardRef(() => AirportModule),
    AgendaModule,
  ],
  providers: [PilotService, PilotProvider],
  controllers: [PilotController],
  exports: [PilotService],
})
export class PilotModule {}
