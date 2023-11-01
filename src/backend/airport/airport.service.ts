import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import logger from '../logger';

import { AirportDto } from './airport.dto';
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

  async doesAirportExist(icao): Promise<boolean> {
    try {
      await this.getAirportFromIcao(icao);

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }

      throw error;
    }
  }

  async createAirport(createData: AirportDto): Promise<AirportDocument>  {
    if (await this.doesAirportExist(createData.icao)) {
      throw new ConflictException();
    }

    const arpt = new this.airportModel(createData);

    await arpt.save();

    return arpt;
  }

  async deleteAirport(icao: string) {
    logger.verbose('deleting airport %s', icao);
    if (!await this.doesAirportExist(icao)) {
      throw new NotFoundException();
    }

    const arpt = await this.airportModel.findOneAndRemove({ icao });

    return arpt;
  }
}
