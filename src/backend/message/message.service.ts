import { Injectable } from '@nestjs/common';

import { CdmService } from '../cdm/cdm.service';
import { PilotService } from '../pilot/pilot.service';

import { AtcDPI, CustomDPIRequest, CustomDPITaxioutTime, TargetDPINow, TargetDPISequenced, TargetDPITarget } from './message.dto';

import { AnyNetworkMessage, LogicalAcknowledgementMessage, MessageClass } from '@/shared/interfaces/message.interface';

const lam: LogicalAcknowledgementMessage = {
  messageClass: MessageClass.Outbound,
  messageType: 'LAM',
};

@Injectable()
export class MessageService {
  constructor(private pilotService: PilotService, private cdmService: CdmService) {}

  private async writeMessageToDb(message: TargetDPINow | TargetDPISequenced | TargetDPITarget | AtcDPI | CustomDPITaxioutTime | CustomDPIRequest) {
    // TODO: write to db somehow
  }
  
  /** tobt now */
  async handleTargetDPINow(message: TargetDPINow): Promise<AnyNetworkMessage> {
    await this.writeMessageToDb(message);

    const pilot = await this.pilotService.getPilotFromCallsign(message.callsign);
    pilot.vacdm.tobtState = message.tobtState;

    // TODO: actually do cdm calculations
    
    return lam;
  }
  
  /** set tobt */
  async handleTargetDPITarget(message: TargetDPITarget): Promise<AnyNetworkMessage> {
    await this.writeMessageToDb(message);

    const pilot = await this.pilotService.getPilotFromCallsign(message.callsign);
    pilot.vacdm.tobtState = message.tobtState;
    pilot.vacdm.tobt = new Date(message.tobt);

    // TODO: actually do cdm calculations
    
    return lam;
  }
  
  /** set asat */
  async handleTargetDPISequenced(message: TargetDPISequenced): Promise<AnyNetworkMessage> {
    await this.writeMessageToDb(message);

    const pilot = await this.pilotService.getPilotFromCallsign(message.callsign);
    pilot.vacdm.asat = new Date(message.asat);

    await pilot.save();
    
    return lam;
  }
  
  /** set aobt */
  async handleAtcDPI(message: AtcDPI): Promise<AnyNetworkMessage> {
    await this.writeMessageToDb(message);

    const pilot = await this.pilotService.getPilotFromCallsign(message.callsign);
    pilot.vacdm.aobt = new Date(message.aobt);

    await pilot.save();
    
    return lam;
  }
  
  /** set exot */
  async handleCustomDPITaxioutTime(message: CustomDPITaxioutTime): Promise<AnyNetworkMessage> {
    await this.writeMessageToDb(message);

    const pilot = await this.pilotService.getPilotFromCallsign(message.callsign);
    pilot.vacdm.exot = message.exot;

    // TODO: actually do cdm calculations

    await pilot.save();
    
    return lam;
  }

  /** set asrt and/or aort */
  async handleCustomDPIRequest(message: CustomDPIRequest): Promise<AnyNetworkMessage> {
    await this.writeMessageToDb(message);

    const pilot = await this.pilotService.getPilotFromCallsign(message.callsign);

    if (message.asrt) {
      pilot.vacdm.asrt = new Date(message.asrt);
    }
    if (message.aort) {
      pilot.vacdm.aort = new Date(message.aort);
    }

    await pilot.save();
    
    return lam;
  }
}
