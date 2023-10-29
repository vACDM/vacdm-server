import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { AIRPORT_MODEL, AirportDocument, AirportModel } from './airport.model';

@Injectable()
export class AirportService {
  constructor(
    @Inject(AIRPORT_MODEL) private airportModel: AirportModel,
  ) {}

  getAllAirports(): Promise<AirportDocument[]> {
    return this.airportModel.find({}).exec();
  }
  
  async getAirportFromId(id: string): Promise<AirportDocument> {
    const arpt = await this.airportModel.findById(id);

    if (!arpt) {
      throw new NotFoundException();
    }

    return arpt;
  }
  
  async getAirportFromIcao(icao: string): Promise<AirportDocument> {
    const arpt = await this.airportModel.findOne({ icao });

    if (!arpt) {
      throw new NotFoundException();
    }

    return arpt;
  }
}
