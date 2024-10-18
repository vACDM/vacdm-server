import Joi from 'joi';
import { JoiSchema, UPDATE, getTypeSchema } from 'nestjs-joi';

import Pilot from '@/shared/interfaces/pilot.interface';
import { ConvertForApis, NestedPartial } from '@/shared/utils/type.utils';

const dateRegex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

export const PilotCallsignValidator = (field: string) => Joi.string().regex(/^[A-Z0-9]{1,12}$/).message(`"${field}" must be between 1 and 12 letters between A and Z or digits between 0 and 9`);
export const TimeValidator = (field: string) => Joi.alternatives(Joi.number().strict(), Joi.string().regex(dateRegex).message(`"${field}" must either be a numeric unix timestamp in milliseconds or a valid iso string`));

class PilotDtoPosition {
  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    lat: number;

  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    lon: number;
}

class PilotDtoFlightplan {
  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    adep: string;

  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    ades: string;
}

class PilotDtoVacdm {
  @JoiSchema(TimeValidator('eobt').required())
  @JoiSchema([UPDATE], TimeValidator('eobt').optional())
    eobt: number;

  @JoiSchema(TimeValidator('tobt').required())
  @JoiSchema([UPDATE], TimeValidator('tobt').optional())
    tobt: number;
}

class PilotDtoClearance {
  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    dep_rwy: string;

  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    sid: string;
}

export class PilotDto implements NestedPartial<ConvertForApis<Pilot>> {
  @JoiSchema(Joi.string().optional())
    _id: string;

  @JoiSchema(PilotCallsignValidator('callsign').required())
  @JoiSchema([UPDATE], Joi.forbidden())
    callsign: string;

  @JoiSchema(Joi.boolean().optional().default(false))
    inactive: boolean;

  @JoiSchema(getTypeSchema(PilotDtoPosition).required())
  @JoiSchema([UPDATE], getTypeSchema(PilotDtoPosition).optional())
    position: PilotDtoPosition;

  @JoiSchema(getTypeSchema(PilotDtoFlightplan).required())
  @JoiSchema([UPDATE], getTypeSchema(PilotDtoFlightplan).optional())
    flightplan: PilotDtoFlightplan;

  @JoiSchema(getTypeSchema(PilotDtoVacdm).required())
  @JoiSchema([UPDATE], getTypeSchema(PilotDtoVacdm).optional())
    vacdm: PilotDtoVacdm;

  @JoiSchema(getTypeSchema(PilotDtoClearance).required())
  @JoiSchema([UPDATE], getTypeSchema(PilotDtoClearance).optional())
    clearance: PilotDtoClearance;
}
