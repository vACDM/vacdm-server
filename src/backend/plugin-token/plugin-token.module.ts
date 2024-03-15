import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database.module';
import { UtilsModule } from '../utils/utils.module';

import { PluginTokenController } from './plugin-token.controller';
import { PluginTokenProvider } from './plugin-token.model';
import { PluginTokenService } from './plugin-token.service';

@Module({
  imports: [DatabaseModule, UtilsModule],
  providers: [PluginTokenService, PluginTokenProvider],
  exports: [PluginTokenService],
  controllers: [PluginTokenController],
})
export class PluginTokenModule {}
