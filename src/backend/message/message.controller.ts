import { Body, Controller, Post } from '@nestjs/common';

import { EarlyDPI, TargetDPINow, TargetDPITarget, TargetDPISequenced, AtcDPI, CustomDPITaxioutTime, CustomDPIRequest } from './message.dto';
import { MessageService } from './message.service';

@Controller('api/v1/message')
export class MessageController {
  constructor(
    private messageService: MessageService,
  ) {}

  @Post('/e-dpi')
  processEarlyDPI(@Body() body: EarlyDPI) {
    return this.messageService.handleEarlyDPI(body);
  }

  @Post('/t-dpi-n')
  processTargetDPINow(@Body() body: TargetDPINow) {
    return this.messageService.handleTargetDPINow(body);
  }

  @Post('/t-dpi-t')
  processTargetDPITarget(@Body() body: TargetDPITarget) {
    return this.messageService.handleTargetDPITarget(body);
  }

  @Post('/t-dpi-s')
  processTargetDPISequenced(@Body() body: TargetDPISequenced) {
    return this.messageService.handleTargetDPISequenced(body);
  }

  @Post('/a-dpi')
  processAtcDPI(@Body() body: AtcDPI) {
    return this.messageService.handleAtcDPI(body);
  }

  @Post('/x-dpi-t')
  processCustomDPITaxioutTime(@Body() body: CustomDPITaxioutTime) {
    return this.messageService.handleCustomDPITaxioutTime(body);
  }

  @Post('/x-dpi-r')
  processCustomDPIRequest(@Body() body: CustomDPIRequest) {
    return this.messageService.handleCustomDPIRequest(body);
  }
}
