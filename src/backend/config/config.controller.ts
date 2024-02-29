import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ConfigService } from './config.service';

@ApiTags('config')
@Controller('api/v1/config')
export class ConfigController {
  constructor(
    private configService: ConfigService,
  ) {}

  @Get()
  getBasePluginConfig() {
    return this.configService.getPluginConfig();
  }

  @Get('plugin')
  getPluginConfig() {
    return this.configService.getExtendedPluginConfig();
  }

  @Get('frontend')
  getFrontendConfig() {
    return this.configService.getFrontendConfig();
  }

  @Get('version')
  getVersion() {
    return this.configService.getVersion();
  }
}
