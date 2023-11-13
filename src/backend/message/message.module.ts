import { Module } from '@nestjs/common';

import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
