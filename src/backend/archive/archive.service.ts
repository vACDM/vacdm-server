import {  forwardRef, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

// import { PilotDocument } from '../pilot/pilot.model';
import { PilotService } from '../pilot/pilot.service';

import { ARCHIVEDPILOT_MODEL, ArchivedPilotModel } from './archivedPilot.model';

@Injectable()
export class ArchiveService {
  constructor(
    @Inject(ARCHIVEDPILOT_MODEL) private archivedPilotModel: Model<ArchivedPilotModel>,
    @Inject(forwardRef(() => PilotService)) private pilotService: PilotService,
  ) {}

  async archivePilot(callsign: string) {
    const fullPilot = await this.pilotService.getPilotFromCallsignWithLog(callsign);

    await this.archivedPilotModel.insertMany([ fullPilot ]);
  }
}
