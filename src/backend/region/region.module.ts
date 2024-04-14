import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database.module';
import { UtilsModule } from '../utils/utils.module';

import { RegionController } from './region.controller';
import { RegionProvider } from './region.model';
import { RegionService } from './region.service';

@Module({
  imports: [
    DatabaseModule,
    UtilsModule,
  ],
  providers: [RegionService, RegionProvider],
  controllers: [RegionController],
})
export class RegionModule {}
