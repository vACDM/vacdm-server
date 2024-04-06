import { join } from 'path';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JoiPipeModule } from 'nestjs-joi';

import { AirportModule } from './airport/airport.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { CdmModule } from './cdm/cdm.module';
import getAppConfig from './config';
import { ConfigModule } from './config/config.module';
import { databaseProviders } from './database.module';
import { EcfmpModule } from './ecfmp/ecfmp.module';
import { EtfmsModule } from './etfms/etfms.module';
import { FrontendProxyMiddleware } from './frontend-proxy/frontend-proxy.middleware';
import { FrontendProxyModule } from './frontend-proxy/frontend-proxy.module';
import { MessageModule } from './message/message.module';
import { PilotModule } from './pilot/pilot.module';
import { PluginTokenModule } from './plugin-token/plugin-token.module';
import { agendaProviders } from './schedule.module';
import { UserModule } from './user/user.module';
import { UtilsModule } from './utils/utils.module';
import { VdgsModule } from './vdgs/vdgs.module';

const { frontendProxy } = getAppConfig();

@Module({
  imports: [
    JoiPipeModule.forRoot({
      pipeOpts: {
        defaultValidationOptions: {
          allowUnknown: false,
        },
      },
    }),
    ...(!frontendProxy ? [
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'frontend'),
        exclude: ['/api/(.*)'],
      }),
    ] : [
      FrontendProxyModule,
    ]),
    AirportModule,
    PilotModule,
    UtilsModule,
    MessageModule,
    CdmModule,
    EtfmsModule,
    UserModule,
    EcfmpModule,
    AuthModule,
    ConfigModule,
    PluginTokenModule,
    VdgsModule,
  ],
  providers: [...databaseProviders, ...agendaProviders],
  exports: [...databaseProviders],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (frontendProxy) {
      consumer
        .apply(FrontendProxyMiddleware)
        .exclude('/api/(.*)')
        .forRoutes('/*');
    }

    consumer
      .apply(AuthMiddleware)
      .forRoutes('/');
  }
}
