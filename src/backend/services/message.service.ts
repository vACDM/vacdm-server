import logger from '../logger';
import { PilotDocument } from '../models/pilot.model';

import pilotService from './pilot.service';

import { AnyInboundMessage, AnyMessage, AnyNetworkMessage, AtcDPI, EarlyDPI, HistoryMessage, MessageClass, TargetDPINow, TargetDPISequenced, TargetDPITarget, XDPITaxioutTime } from '@/shared/interfaces/message.interface';

async function writeMessageToLog(message: AnyMessage) {
  logger.debug('MESSAGE => %s', JSON.stringify(message));
}

async function handleEarlyDPI(message: EarlyDPI, pilot: PilotDocument): Promise<AnyNetworkMessage> {
  return {
    messageClass: MessageClass.Outbound,
    messageType: 'LAM',
  };
}

async function handleTargetDPINow(message: TargetDPINow, pilot: PilotDocument): Promise<AnyNetworkMessage> {
  return {
    messageClass: MessageClass.Outbound,
    messageType: 'LAM',
  };
}

async function handleTargetDPITarget(message: TargetDPITarget, pilot: PilotDocument): Promise<AnyNetworkMessage> {
  return {
    messageClass: MessageClass.Outbound,
    messageType: 'LAM',
  };
}

async function handleTargetDPISequenced(message: TargetDPISequenced, pilot: PilotDocument): Promise<AnyNetworkMessage> {
  return {
    messageClass: MessageClass.Outbound,
    messageType: 'LAM',
  };
}

async function handleAtcDPI(message: AtcDPI, pilot: PilotDocument): Promise<AnyNetworkMessage> {
  return {
    messageClass: MessageClass.Outbound,
    messageType: 'LAM',
  };
}

async function handleXDPITaxioutTime(message: XDPITaxioutTime, pilot: PilotDocument): Promise<AnyNetworkMessage> {
  return {
    messageClass: MessageClass.Outbound,
    messageType: 'LAM',
  };
}

async function handleInboundMessage(message: AnyInboundMessage) {
  try {
    await writeMessageToLog(message);

    const pilot = await pilotService.getPilot(message.callsign);

    let response: AnyNetworkMessage | undefined = undefined;

    switch (message.messageType) {
      case 'E-DPI': {
        response = await handleEarlyDPI(message, pilot);
        break;
      }
      case 'T-DPI-n': {
        response = await handleTargetDPINow(message, pilot);
        break;
      }
      case 'T-DPI-t': {
        response = await handleTargetDPITarget(message, pilot);
        break;
      }
      case 'T-DPI-s': {
        response = await handleTargetDPISequenced(message, pilot);
        break;
      }
      case 'A-DPI': {
        response = await handleAtcDPI(message, pilot);
        break;
      }
      case 'X-DPI-t': {
        response = await handleXDPITaxioutTime(message, pilot);
        break;
      }
    }

    if (response) {
      await writeMessageToLog(response);
    }

    return response;
  } catch (error) {
    if (error.message == 'pilot not found') {
      const msg: HistoryMessage = { messageClass: MessageClass.History, msg: 'not found', callsign: message.callsign };
      await writeMessageToLog(msg);
      return msg;
    }

    throw error;
  }
}

export default {
  handleInboundMessage,
};
