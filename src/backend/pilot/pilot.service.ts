import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { PilotDto } from './pilot.dto';
import { PILOT_MODEL, PilotDocument, PilotModel } from './pilot.model';

@Injectable()
export class PilotService {
  constructor(
    @Inject(PILOT_MODEL) private pilotModel: PilotModel,
  ) {}

  getPilots(filter: object): Promise<PilotDocument[]> {
    return this.pilotModel.find(filter).exec();
  }

  getAllPilots(): Promise<PilotDocument[]> {
    return this.getPilots({});
  }

  async doesPilotExist(callsign): Promise<boolean> {
    try {
      await this.getPilots({ callsign });

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
}
