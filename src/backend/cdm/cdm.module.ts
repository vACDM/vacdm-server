import { Module, forwardRef } from '@nestjs/common';

import { AirportModule } from '../airport/airport.module';
import { PilotModule } from '../pilot/pilot.module';
import { UtilsModule } from '../utils/utils.module';

import { CdmService } from './cdm.service';

@Module({
  providers: [CdmService],
  exports: [CdmService],
  imports: [
    forwardRef(() => AirportModule),
    forwardRef(() => PilotModule),
    UtilsModule,
  ],
})
export class CdmModule {}
