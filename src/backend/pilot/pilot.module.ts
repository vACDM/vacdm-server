import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database.module';

import { PilotController } from './pilot.controller';
import { PilotProvider } from './pilot.model';
import { PilotService } from './pilot.service';

@Module({
  imports: [DatabaseModule],
  providers: [PilotService, PilotProvider],
  controllers: [PilotController],
  exports: [PilotService],
})
export class PilotModule {}
