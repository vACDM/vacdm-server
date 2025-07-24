import Joi from 'joi';
import { JoiSchema, UPDATE, getTypeSchema } from 'nestjs-joi';

import IAirport, { IAirportCapacity, IAirportCapacityOverride, IAirportProfile, IAirportProfileTimetable, IAirportTaxizone, IAirportTaxizoneTaxitime } from '../../shared/interfaces/airport.interface';
import { JoiStringArray } from '../_utils/dto.utils';
import { UtilsService } from '../utils/utils.service';

export const AirportIcaoValidator = Joi.string().regex(/^[A-Z0-9]{4}$/).message('"icao" must be four uppercase letters between A and Z or digits between 0 and 9');

class AirportDtoTaxizoneTaxitime implements IAirportTaxizoneTaxitime {
  @JoiSchema(Joi.string().optional())
    _id: string;

  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    runway: string;

  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    minutes: number;
}

class AirportDtoTaxizone implements IAirportTaxizone {
  @JoiSchema(Joi.string().optional())
    _id: string;

  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    label: string;

  @JoiSchema(Joi.boolean().required())
  @JoiSchema([UPDATE], Joi.boolean().optional())
    taxiout: boolean;

  @JoiSchema(Joi.array().items(Joi.string()).min(3).required())
  @JoiSchema([UPDATE], Joi.array().items(Joi.string().regex(UtilsService.scopeCoordsRegex)).min(3).optional())
    polygon: string[];

  @JoiSchema(Joi.array().items(getTypeSchema(AirportDtoTaxizoneTaxitime)).required())
  @JoiSchema([UPDATE], Joi.array().items(getTypeSchema(AirportDtoTaxizoneTaxitime)).optional())
    taxitimes!: AirportDtoTaxizoneTaxitime[];
}

class AirportDtoCapacity implements IAirportCapacity {
  @JoiSchema(Joi.string().optional())
    _id: string;

  @JoiSchema(JoiStringArray.min(1).required())
  @JoiSchema([UPDATE], JoiStringArray.min(1).optional())
    runways: string[];

  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    capacity: number;

  @JoiSchema(Joi.string().allow('').optional())
  @JoiSchema([UPDATE], Joi.string().allow('').optional())
    alias: string;
}

class AirportDtoProfileTimetable implements IAirportProfileTimetable {
  @JoiSchema(Joi.number().required())
    from: number;

  @JoiSchema(Joi.number().required())
    until: number;
}

class AirportDtoProfile implements IAirportProfile {
  @JoiSchema(Joi.string().optional())
    _id: string;

  @JoiSchema(Joi.string().optional())
    label: string;

  @JoiSchema(Joi.array().items(getTypeSchema(AirportDtoCapacity)).required())
  @JoiSchema([UPDATE], Joi.array().items(getTypeSchema(AirportDtoCapacity)).optional())
    capacities: AirportDtoCapacity[];

  @JoiSchema(Joi.boolean().default(false))
    default: boolean;

  @JoiSchema(Joi.boolean().default(false))
    forceActive: boolean;

  @JoiSchema(getTypeSchema(AirportDtoProfileTimetable).optional())
    timetable?: AirportDtoProfileTimetable;
}

class AirportDtoCapacityOverride implements IAirportCapacityOverride {
  @JoiSchema(Joi.string().optional())
    _id: string;

  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    blockId: number;

  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    capacityIdentifier: string;

  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    newCapacity: number;
}

export class AirportDto implements IAirport {
  @JoiSchema(Joi.string().optional())
    _id: string;

  @JoiSchema(AirportIcaoValidator.required())
  @JoiSchema([UPDATE], Joi.forbidden())
    icao!: string;

  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    defaultTaxitime: number;

  @JoiSchema(Joi.array().items(getTypeSchema(AirportDtoTaxizone)).required())
  @JoiSchema([UPDATE], Joi.array().items(getTypeSchema(AirportDtoTaxizone)).optional())
    taxizones!: AirportDtoTaxizone[];

  @JoiSchema(Joi.array().items(getTypeSchema(AirportDtoProfile)).min(1).required())
  @JoiSchema([UPDATE], Joi.array().items(getTypeSchema(AirportDtoProfile)).min(1).optional())
    profiles: AirportDtoProfile[];

  @JoiSchema(Joi.forbidden())
    capacityOverrides: AirportDtoCapacityOverride[];
}
