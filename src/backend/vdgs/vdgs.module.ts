import { Module } from '@nestjs/common';

import { AirportModule } from '../airport/airport.module';
import { PilotModule } from '../pilot/pilot.module';
import { UtilsModule } from '../utils/utils.module';

import { VdgsController } from './vdgs.controller';

@Module({
  controllers: [VdgsController],
  imports: [
    AirportModule,
    PilotModule,
    UtilsModule,
  ],
})
export class VdgsModule {}
