import { Module } from '@nestjs/common';

import { AirportModule } from '../airport/airport.module';

import { CdmService } from './cdm.service';

@Module({
  providers: [CdmService],
  exports: [CdmService],
  imports: [AirportModule],
})
export class CdmModule {}
