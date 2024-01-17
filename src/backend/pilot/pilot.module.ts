import { Module, forwardRef } from '@nestjs/common';

import { AirportModule } from '../airport/airport.module';
import { DatabaseModule } from '../database.module';
import { ScheduleModule } from '../schedule.module';
import { UtilsModule } from '../utils/utils.module';

import { PilotController } from './pilot.controller';
import { PilotProvider } from './pilot.model';
import { PilotService } from './pilot.service';

@Module({
  imports: [
    DatabaseModule,
    UtilsModule,
    forwardRef(() => AirportModule),
    ScheduleModule,
  ],
  providers: [PilotService, PilotProvider],
  controllers: [PilotController],
  exports: [PilotService],
})
export class PilotModule {}
