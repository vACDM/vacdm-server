import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import getAppConfig from '../config';

const { nats } = getAppConfig();

@Module({
  imports: [
    ClientsModule.register([{
      name: 'CLIENT_NATS',
      transport: Transport.NATS,
      options: nats,
    }]),
  ],
})
export class NatsModule {}
