import { Module } from '@nestjs/common';

import { AirportModule } from '../airport/airport.module';
import { EtfmsModule } from '../etfms/etfms.module';
import { PilotModule } from '../pilot/pilot.module';

import { CdmService } from './cdm.service';

@Module({
  providers: [CdmService],
  exports: [CdmService],
  imports: [AirportModule, PilotModule, EtfmsModule],
})
export class CdmModule {}
