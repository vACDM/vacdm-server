import { Injectable } from '@nestjs/common';

import { AtcDPI, CustomDPIRequest, CustomDPITaxioutTime, TargetDPINow, TargetDPISequenced, TargetDPITarget } from './message.dto';

import { AnyNetworkMessage, MessageClass } from '@/shared/interfaces/message.interface';

@Injectable()
export class MessageService {
  private async writeMessageToDb(message: TargetDPINow | TargetDPISequenced | TargetDPITarget | AtcDPI | CustomDPITaxioutTime | CustomDPIRequest) {
    // TODO: write to db somehow
  }
  
  async handleTargetDPINow(message: TargetDPINow): Promise<AnyNetworkMessage> {
    await this.writeMessageToDb(message);
    
    return {
      messageClass: MessageClass.Outbound,
      messageType: 'LAM',
    };
  }
  
  async handleTargetDPITarget(message: TargetDPITarget): Promise<AnyNetworkMessage> {
    await this.writeMessageToDb(message);
    
    return {
      messageClass: MessageClass.Outbound,
      messageType: 'LAM',
    };
  }
  
  async handleTargetDPISequenced(message: TargetDPISequenced): Promise<AnyNetworkMessage> {
    await this.writeMessageToDb(message);
    
    return {
      messageClass: MessageClass.Outbound,
      messageType: 'LAM',
    };
  }
  
  async handleAtcDPI(message: AtcDPI): Promise<AnyNetworkMessage> {
    await this.writeMessageToDb(message);
    
    return {
      messageClass: MessageClass.Outbound,
      messageType: 'LAM',
    };
  }
  
  async handleCustomDPITaxioutTime(message: CustomDPITaxioutTime): Promise<AnyNetworkMessage> {
    await this.writeMessageToDb(message);
    
    return {
      messageClass: MessageClass.Outbound,
      messageType: 'LAM',
    };
  }

  async handleCustomDPIRequest(message: CustomDPIRequest): Promise<AnyNetworkMessage> {
    await this.writeMessageToDb(message);
    
    return {
      messageClass: MessageClass.Outbound,
      messageType: 'LAM',
    };
  }
}
