import { Client, Transport } from '@nestjs/microservices';

import getAppConfig from '../config';

export function NatsClient(): PropertyDecorator {
  return Client({ transport: Transport.NATS, options: getAppConfig().nats });
}
