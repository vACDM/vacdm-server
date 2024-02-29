import { Module } from '@nestjs/common';

import { EcfmpModule } from '../ecfmp/ecfmp.module';

import { EtfmsService } from './etfms.service';

@Module({
  imports: [EcfmpModule],
  providers: [EtfmsService],
  exports: [EtfmsService],
})
export class EtfmsModule {}
