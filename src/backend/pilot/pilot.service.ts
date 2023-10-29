import { Inject, Injectable } from '@nestjs/common';

import { PilotDto } from './dto/pilot.create.dto';
import { PILOT_MODEL, PilotDocument, PilotModel } from './pilot.model';

@Injectable()
export class PilotService {
  constructor(
    @Inject(PILOT_MODEL) private pilotModel: PilotModel,
  ) {}

  getAllPilots(): Promise<PilotDocument[]> {
    return this.pilotModel.find({}).exec();
  }

  async createPilot(createData: PilotDto): Promise<PilotDocument>  {
    const pilot = new this.pilotModel(createData);
        
    // TODO

    await pilot.save();

    return pilot;
  }
}
