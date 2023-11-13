import { join } from 'path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JoiPipeModule } from 'nestjs-joi';

import { AirportModule } from './airport/airport.module';
import { CdmModule } from './cdm/cdm.module';
import { databaseProviders } from './database.module';
import { EtfmsModule } from './etfms/etfms.module';
import { MessageModule } from './message/message.module';
import { PilotModule } from './pilot/pilot.module';
import { UserModule } from './user/user.module';
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
    MessageModule,
    CdmModule,
    EtfmsModule,
    UserModule,
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class AppModule {}
