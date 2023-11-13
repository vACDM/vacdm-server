import { Module } from '@nestjs/common';

import { EtfmsService } from './etfms.service';

@Module({
  providers: [EtfmsService],
  exports: [EtfmsService],
})
export class EtfmsModule {}
