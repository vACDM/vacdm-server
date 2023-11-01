import Joi from 'joi';
import { JoiSchema, UPDATE, getTypeSchema } from 'nestjs-joi';

import { UtilsService } from '../utils/utils.service';

export const AirportIcaoValidator = Joi.string().regex(/^[A-Z0-9]{4}$/).message('"icao" must be four uppercase letters between A and Z or digits between 0 and 9');

class AirportDtoTaxizoneTaxitime {
  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    rwy_designator: string;

  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    minutes: number;
}

class AirportDtoTaxizone {
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

class AirportDtoCapacity {
  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    rwy_designator: string;

  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    capacity: number;

  @JoiSchema(Joi.string().required())
  @JoiSchema([UPDATE], Joi.string().optional())
    alias: string;
}

export class AirportDto {
  @JoiSchema(AirportIcaoValidator.required())
  @JoiSchema([UPDATE], Joi.forbidden())
    icao!: string;

  @JoiSchema(Joi.number().required())
  @JoiSchema([UPDATE], Joi.number().optional())
    standard_taxitime: number;

  @JoiSchema(Joi.array().items(getTypeSchema(AirportDtoTaxizone)).required())
  @JoiSchema([UPDATE], Joi.array().items(getTypeSchema(AirportDtoTaxizone)).optional())
    taxizones!: AirportDtoTaxizone[];

  @JoiSchema(Joi.array().items(getTypeSchema(AirportDtoCapacity)).required())
  @JoiSchema([UPDATE], Joi.array().items(getTypeSchema(AirportDtoCapacity)).optional())
    capacities!: AirportDtoCapacity[];
}
