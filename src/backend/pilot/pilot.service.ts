import { Inject, Injectable } from '@nestjs/common';

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

  async createPilot(createData: PilotDto): Promise<PilotDocument>  {
    const pilot = new this.pilotModel(createData);
        
    // TODO

    await pilot.save();

    return pilot;
  }
}
