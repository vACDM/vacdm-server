import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database.module';

import { EcfmpService } from './ecfmp.service';

@Module({
  imports: [DatabaseModule],
  providers: [EcfmpService],
  exports: [EcfmpService],
})
export class EcfmpModule {}
