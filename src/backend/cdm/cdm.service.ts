import { Injectable } from '@nestjs/common';

import { AirportService } from '../airport/airport.service';
import { PilotDocument } from '../pilot/pilot.model';
import { PilotService } from '../pilot/pilot.service';

@Injectable()
export class CdmService {
  constructor(
    private airportService: AirportService,
    private pilotService: PilotService,
  ) {}
  
  private async determineInitialBlock(pilot: PilotDocument) {
    // TODO
  }

  async putIntoBlock(pilot: PilotDocument) {
    const allPilots = await this.pilotService.getPilots({
      'flightplan.adep': pilot.flightplan.adep,
      'vacdm.blockRwyDesignator': pilot.vacdm.blockRwyDesignator,
    });
    
    // TODO
  }
}
