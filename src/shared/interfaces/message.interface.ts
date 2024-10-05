export enum TobtState {
  FLIGHTPLAN = 'FLIGHTPLAN',
  NOW = 'NOW',
  CONFIRMED = 'CONFIRMED',
}

export enum MessageClass {
  Inbound = 'IM',
  Outbound = 'OM',
  Internal = 'INT',
  History = 'HI',
}

export interface ClientMessage {
  messageClass: MessageClass.Inbound | MessageClass.Internal;
  callsign: string;
}

export interface NetworkMessage {
  messageClass: MessageClass.Outbound;
}

export interface HistoryMessage {
  messageClass: MessageClass.History;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface EarlyDPI extends ClientMessage {
  messageType: 'E-DPI';

  tobtState: TobtState.FLIGHTPLAN;

  eobt: string;
  tobt: string; // idk?
}

export interface TargetDPINow extends ClientMessage {
  messageType: 'T-DPI-n';

  tobtState: TobtState.NOW;
}

export interface TargetDPITarget extends ClientMessage {
  messageType: 'T-DPI-t';

  tobtState: TobtState.CONFIRMED;

  tobt: string;
}

export interface TargetDPISequenced extends ClientMessage {
  messageType: 'T-DPI-s';

  asat: string;
}

export interface AtcDPI extends ClientMessage {
  messageType: 'A-DPI';

  aobt: string;
}

export interface XDPITaxioutTime extends ClientMessage {
  messageType: 'X-DPI-t';

  exot: string;
}

export interface LogicalAcknowledgementMessage extends NetworkMessage {
  messageType: 'LAM';
}

export interface LogicalRejectionMessage extends NetworkMessage {
  messageType: 'LRM';
}


export type AnyDPI = EarlyDPI | TargetDPINow | TargetDPITarget | TargetDPISequenced | AtcDPI | XDPITaxioutTime;
export type AnyNetworkMessage = LogicalAcknowledgementMessage | LogicalRejectionMessage;

export type AnyInboundMessage = AnyDPI;
export type AnyOutboundMessage = AnyNetworkMessage;
export type AnyHistoryMessage = HistoryMessage;

export type AnyMessage = AnyHistoryMessage | AnyInboundMessage | AnyOutboundMessage;
