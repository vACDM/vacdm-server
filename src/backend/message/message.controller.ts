import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { TargetDPINow, TargetDPITarget, TargetDPISequenced, AtcDPI, CustomDPITaxioutTime, CustomDPIRequest } from './message.dto';
import { MessageService } from './message.service';

@ApiTags('messages')
@Controller('api/v1/messages')
export class MessageController {
  constructor(
    private messageService: MessageService,
  ) {}

  @Post('/t-dpi-n')
  async processTargetDPINow(@Body() body: TargetDPINow) {
    await this.messageService.writeMessageToDb(body);
    const res = await this.messageService.handleTargetDPINow(body);
    await this.messageService.writeMessageToDb(res);
  }

  @Post('/t-dpi-t')
  async processTargetDPITarget(@Body() body: TargetDPITarget) {
    await this.messageService.writeMessageToDb(body);
    const res = await this.messageService.handleTargetDPITarget(body);
    await this.messageService.writeMessageToDb(res);
  }

  @Post('/t-dpi-s')
  async processTargetDPISequenced(@Body() body: TargetDPISequenced) {
    await this.messageService.writeMessageToDb(body);
    const res = await this.messageService.handleTargetDPISequenced(body);
    await this.messageService.writeMessageToDb(res);
  }

  @Post('/a-dpi')
  async processAtcDPI(@Body() body: AtcDPI) {
    await this.messageService.writeMessageToDb(body);
    const res = await this.messageService.handleAtcDPI(body);
    await this.messageService.writeMessageToDb(res);
  }

  @Post('/x-dpi-t')
  async processCustomDPITaxioutTime(@Body() body: CustomDPITaxioutTime) {
    await this.messageService.writeMessageToDb(body);
    const res = await this.messageService.handleCustomDPITaxioutTime(body);
    await this.messageService.writeMessageToDb(res);
  }

  @Post('/x-dpi-r')
  async processCustomDPIRequest(@Body() body: CustomDPIRequest) {
    await this.messageService.writeMessageToDb(body);
    const res = await this.messageService.handleCustomDPIRequest(body);
    await this.messageService.writeMessageToDb(res);
  }
}
