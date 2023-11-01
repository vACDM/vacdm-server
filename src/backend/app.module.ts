import { join } from 'path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JoiPipeModule } from 'nestjs-joi';

import { AirportModule } from './airport/airport.module';
import { databaseProviders } from './database.module';
import { PilotModule } from './pilot/pilot.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    JoiPipeModule.forRoot({
      pipeOpts: {
        defaultValidationOptions: {
          allowUnknown: false,
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
      exclude: ['/api/(.*)'],
    }),
    AirportModule,
    PilotModule,
    UtilsModule,
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class AppModule {}
