import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, Ctx, EventPattern, NatsContext, Payload } from '@nestjs/microservices';

import logger from '../logger';

@Controller()
export class AirportMessageHandler {
  constructor(
    @Inject('CLIENT_NATS') public natsClient: ClientProxy,
  ) {}

  @EventPattern('vacdm-client.*')
  handleAirportMessage(@Payload() data: unknown, @Ctx() context: NatsContext): void {
    logger.warn('inbound message %s: %o', context.getSubject(), data);

    logger.error('this: %o', this);

    this.natsClient.emit('vacdm.eddm', 'sdfsdf');
  }
}
