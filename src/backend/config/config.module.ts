import { Module } from '@nestjs/common';

import { AirportModule } from '../airport/airport.module';

import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

@Module({
  controllers: [ConfigController],
  providers: [ConfigService],
  imports: [AirportModule],
})
export class ConfigModule {}
