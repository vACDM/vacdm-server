import { Injectable } from '@nestjs/common';

import { CdmService } from '../cdm/cdm.service';
import { PilotService } from '../pilot/pilot.service';
import { UtilsService } from '../utils/utils.service';

import { AtcDPI, CustomDPIRequest, CustomDPITaxioutTime, TargetDPINow, TargetDPISequenced, TargetDPITarget } from './message.dto';

import { AnyNetworkMessage, LogicalAcknowledgementMessage, LogicalRejectionMessage, MessageClass, TobtState } from '@/shared/interfaces/message.interface';

const ackMsg: LogicalAcknowledgementMessage = {
  messageClass: MessageClass.Outbound,
  messageType: 'LAM',
};

const rejMsg: LogicalRejectionMessage = {
  messageClass: MessageClass.Outbound,
  messageType: 'LRM',
};

@Injectable()
export class MessageService {
  constructor(private pilotService: PilotService, private cdmService: CdmService, private utilsService: UtilsService) {}

  async writeMessageToDb(message: TargetDPINow | TargetDPISequenced | TargetDPITarget | AtcDPI | CustomDPITaxioutTime | CustomDPIRequest | AnyNetworkMessage) {
    // TODO: write to db somehow
  }
  
  /** tobt now */
  async handleTargetDPINow(message: TargetDPINow): Promise<AnyNetworkMessage> {
    const pilot = await this.pilotService.getPilotFromCallsign(message.callsign);

    if (pilot.vacdm.asat || pilot.vacdm.aobt) {
      return rejMsg;
    }

    pilot.vacdm.tobtState = TobtState.NOW;
    pilot.vacdm.tobt = new Date();

    this.cdmService.putPilotIntoBlock(pilot);
    
    return ackMsg;
  }
  
  /** set tobt */
  async handleTargetDPITarget(message: TargetDPITarget): Promise<AnyNetworkMessage> {
    const pilot = await this.pilotService.getPilotFromCallsign(message.callsign);

    if (pilot.vacdm.asat || pilot.vacdm.aobt) {
      return rejMsg;
    }

    pilot.vacdm.tobtState = TobtState.CONFIRMED;
    pilot.vacdm.tobt = new Date(message.tobt);

    this.cdmService.putPilotIntoBlock(pilot);
    
    return ackMsg;
  }
  
  /** set asat */
  async handleTargetDPISequenced(message: TargetDPISequenced): Promise<AnyNetworkMessage> {
    const pilot = await this.pilotService.getPilotFromCallsign(message.callsign);
    pilot.vacdm.asat = new Date(message.asat);

    await pilot.save();
    
    return ackMsg;
  }
  
  /** set aobt */
  async handleAtcDPI(message: AtcDPI): Promise<AnyNetworkMessage> {
    const pilot = await this.pilotService.getPilotFromCallsign(message.callsign);
    
    pilot.vacdm.aobt = new Date(message.aobt);
    pilot.vacdm.ttot = this.utilsService.addMinutes(pilot.vacdm.aobt, pilot.vacdm.exot);

    await pilot.save();
    
    return ackMsg;
  }
  
  /** set exot */
  async handleCustomDPITaxioutTime(message: CustomDPITaxioutTime): Promise<AnyNetworkMessage> {
    const pilot = await this.pilotService.getPilotFromCallsign(message.callsign);

    pilot.vacdm.exot = message.exot;
    pilot.vacdm.manualExot = true;
    pilot.vacdm.ttot = new Date(-1);

    this.cdmService.putPilotIntoBlock(pilot);

    await pilot.save();
    
    return ackMsg;
  }

  /** set asrt and/or aort */
  async handleCustomDPIRequest(message: CustomDPIRequest): Promise<AnyNetworkMessage> {
    const pilot = await this.pilotService.getPilotFromCallsign(message.callsign);

    if (message.asrt) {
      pilot.vacdm.asrt = new Date(message.asrt);
    }
    if (message.aort) {
      pilot.vacdm.aort = new Date(message.aort);
    }

    await pilot.save();
    
    return ackMsg;
  }
}
