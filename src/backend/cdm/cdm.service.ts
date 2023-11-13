import { Injectable } from '@nestjs/common';

import { AirportService } from '../airport/airport.service';
import { PilotDocument } from '../pilot/pilot.model';

@Injectable()
export class CdmService {
  constructor(
    private airportService: AirportService,
  ) {}
  
  async doStuff(pilot: PilotDocument) {
    // TODO
  }
}
