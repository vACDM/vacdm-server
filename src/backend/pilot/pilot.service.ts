import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { FilterQuery } from 'mongoose';

import { AirportService } from '../airport/airport.service';
import logger from '../logger';
import { UtilsService } from '../utils/utils.service';

import { PilotDto } from './pilot.dto';
import { PILOT_MODEL, PilotDocument, PilotModel } from './pilot.model';

import Pilot from '@/shared/interfaces/pilot.interface';

@Injectable()
export class PilotService {
  constructor(
    @Inject(PILOT_MODEL) private pilotModel: PilotModel,
    private utilsService: UtilsService,
    @Inject(forwardRef(() => AirportService)) private airportService: AirportService,
  ) {}

  getPilots(filter: FilterQuery<Pilot>): Promise<PilotDocument[]> {
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
    // 0. write history message
    // 1. determine departure runway and log it
    pilot.vacdm.blockRwyDesignator = await this.airportService.determineRunway(pilot);
    
    // 2. determine taxi zone and log it
    ({
      exot: pilot.vacdm.exot,
      taxiout: pilot.vacdm.taxizoneIsTaxiout,
      taxizone: pilot.vacdm.taxizone,
    } = await this.airportService.determineTaxizone(pilot));
    
    // 3. determine departure block and log it

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

    let resave = false;

    if (!pilot) {
      throw new NotFoundException();
    }

    if (diff.clearance?.dep_rwy) {
      resave = true;
      pilot.vacdm.blockRwyDesignator = await this.airportService.determineRunway(pilot);
    }

    if (pilot.vacdm.asat.valueOf() === -1 && (diff.position?.lat || diff.position?.lon)) {
      resave = true;
      ({
        exot: pilot.vacdm.exot,
        taxiout: pilot.vacdm.taxizoneIsTaxiout,
        taxizone: pilot.vacdm.taxizone,
      } = await this.airportService.determineTaxizone(pilot));
    }

    // TODO: run through calculation steps again based on tobt state (last DPI message)

    if (resave) {
      await pilot.save();
    } 

    return pilot;
  }
}
