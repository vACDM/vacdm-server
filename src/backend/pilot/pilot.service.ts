import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import logger from '../logger';
import { UtilsService } from '../utils/utils.service';

import { PilotDto } from './pilot.dto';
import { PILOT_MODEL, PilotDocument, PilotModel } from './pilot.model';

@Injectable()
export class PilotService {
  constructor(
    @Inject(PILOT_MODEL) private pilotModel: PilotModel,
    private utilsService: UtilsService,
  ) {}

  getPilots(filter: object): Promise<PilotDocument[]> {
    return this.pilotModel.find(filter).exec();
  }

  getAllPilots(): Promise<PilotDocument[]> {
    return this.getPilots({});
  }

  async getPilotFromCallsign(callsign: string): Promise<PilotDocument> {
    logger.debug('trying to get an pilot with callsign "%s"', callsign);
    const arpt = await this.pilotModel.findOne({ icao: callsign });
    
    if (!arpt) {
      logger.verbose('could not find pilot with callsign "%s"', callsign);
      throw new NotFoundException();
    }

    return arpt;
  }

  async doesPilotExist(callsign): Promise<boolean> {
    try {
      await this.getPilotFromCallsign(callsign);

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }

      throw error;
    }
  }

  async createPilot(createData: PilotDto): Promise<PilotDocument>  {
    const pilot = new this.pilotModel(createData);
        
    // TODO: determine steps to take when pilot is created

    await pilot.save();

    return pilot;
  }

  async deletePilot(callsign: string): Promise<PilotDocument> {
    const pilot = await this.pilotModel.findOneAndDelete({ callsign });

    if (!pilot) {
      throw new NotFoundException();
    }

    // TODO: get and archive pilot and pilot logs

    return pilot;
  }

  async updatePilot(callsign: string, diff: Partial<PilotDto>): Promise<PilotDocument> {
    const diffOps = this.utilsService.getDiffOps(diff);

    const pilot = await this.pilotModel.findOneAndUpdate({ callsign }, { $set: diffOps }, { new: true });

    if (!pilot) {
      throw new NotFoundException();
    }

    return pilot;
  }
}
