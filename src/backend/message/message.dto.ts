import Joi from 'joi';
import { JoiSchema, JoiSchemaCustomization, JoiSchemaExtends } from 'nestjs-joi';

import { MessageClass, TobtState } from '../../shared/interfaces/message.interface';
import { PilotCallsignValidator } from '../pilot/pilot.dto';

const TimeStringValidator = Joi.string().regex(/^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/);

class BaseClientMessage {
  @JoiSchema(PilotCallsignValidator.required())
    callsign: string;

  @JoiSchema(Joi.string().allow(MessageClass.Inbound, MessageClass.Internal))
    messageClass: MessageClass.Inbound | MessageClass.Internal;
}

@JoiSchemaExtends(BaseClientMessage)
export class EarlyDPI extends BaseClientMessage {
  @JoiSchema(Joi.string().allow('E-DPI'))
    messageType: 'E-DPI';

  @JoiSchema(Joi.string().allow(TobtState.FLIGHTPLAN))
    tobtState: TobtState.FLIGHTPLAN;

  @JoiSchema(TimeStringValidator.required())
    eobt: string;

}

@JoiSchemaExtends(BaseClientMessage)
export class TargetDPINow extends BaseClientMessage {
  @JoiSchema(Joi.string().allow('T-DPI-n').required())
    messageType: 'T-DPI-n';

  @JoiSchema(Joi.string().allow(TobtState.NOW).required())
    tobtState: TobtState.NOW;
}

@JoiSchemaExtends(BaseClientMessage)
export class TargetDPITarget extends BaseClientMessage {
  @JoiSchema(Joi.string().allow('T-DPI-t').required())
    messageType: 'T-DPI-t';

  @JoiSchema(Joi.string().allow(TobtState.CONFIRMED).required())
    tobtState: TobtState.CONFIRMED;

  @JoiSchema(TimeStringValidator.required())
    tobt: string;
}

@JoiSchemaExtends(BaseClientMessage)
export class TargetDPISequenced extends BaseClientMessage {
  @JoiSchema(Joi.string().allow('T-DPI-s').required())
    messageType: 'T-DPI-s';

  @JoiSchema(TimeStringValidator.required())
    asat: string;
}

@JoiSchemaExtends(BaseClientMessage)
export class AtcDPI extends BaseClientMessage {
  @JoiSchema(Joi.string().allow('A-DPI').required())
    messageType: 'A-DPI';

  @JoiSchema(TimeStringValidator.required())
    aobt: string;
}

@JoiSchemaExtends(BaseClientMessage)
export class CustomDPITaxioutTime extends BaseClientMessage {
  @JoiSchema(Joi.string().allow('X-DPI-taxi').required())
    messageType: 'X-DPI-taxi';

  @JoiSchema(Joi.number().required())
    exot: number;
}

@JoiSchemaExtends(BaseClientMessage)
@JoiSchemaCustomization(schema => schema.or('asrt', 'aort'))
export class CustomDPIRequest extends BaseClientMessage {
  @JoiSchema(Joi.string().allow('X-DPI-req').required())
    messageType: 'X-DPI-req';

  @JoiSchema(TimeStringValidator.required())
    asrt: string;

  @JoiSchema(TimeStringValidator.required())
    aort: string;
}
