import Joi from 'joi';
import { JoiSchema, UPDATE, getTypeSchema } from 'nestjs-joi';

export class PilotDtoPosition {
  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    lat: number;

  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    lon: number;
}

export class PilotDtoFlightplan {
  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    flight_rules: string;

  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    departure: string;

  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    arrival: string;
}

export class PilotDtoVacdm {
  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    eobt: number;

  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    tobt: number;
}

export class PilotDtoClearance {
  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    dep_rwy: string;

  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    sid: string;

  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    initial_climb: number;

  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    assigned_squawk: number;

  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    current_squawk: number;
}

export class PilotDto {
  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.forbidden())
    callsign!: string;
  
  @JoiSchema(Joi.boolean().required())
  @JoiSchema([UPDATE], Joi.boolean().optional())
    inactive!: boolean;

  @JoiSchema(getTypeSchema(PilotDtoPosition).required())
  @JoiSchema([UPDATE], getTypeSchema(PilotDtoPosition).optional())
    position!: PilotDtoPosition;

  @JoiSchema(getTypeSchema(PilotDtoFlightplan).required())
  @JoiSchema([UPDATE], getTypeSchema(PilotDtoFlightplan).optional())
    flightplan!: PilotDtoFlightplan;

  @JoiSchema(getTypeSchema(PilotDtoVacdm).required())
  @JoiSchema([UPDATE], getTypeSchema(PilotDtoVacdm).optional())
    vacdm!: PilotDtoVacdm;

  @JoiSchema(getTypeSchema(PilotDtoClearance).required())
  @JoiSchema([UPDATE], getTypeSchema(PilotDtoClearance).optional())
    clearance!: PilotDtoClearance;
}
