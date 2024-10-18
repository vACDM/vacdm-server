import { ConflictException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import Agenda from 'agenda';
import { FilterQuery } from 'mongoose';
import { Parser } from 'peggy';

import { AirportService } from '../airport/airport.service';
import { CdmService } from '../cdm/cdm.service';
import getAppConfig from '../config';
import logger from '../logger';
import { AGENDA_PROVIDER } from '../schedule.module';
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
    @Inject(AGENDA_PROVIDER) private agenda: Agenda,
    @Inject(forwardRef(() => CdmService)) private cdmService: CdmService,
  ) {
    this.agenda.define('PILOT_cleanupPilots', this.cleanupPilots.bind(this));
    this.agenda.every('10 minutes', 'PILOT_cleanupPilots');

    this.parser = this.utilsService.generateFilter({
      adep: 'flightplan.adep',
      ades: 'flightplan.ades',
    }, true);
  }

  private parser: Parser;

  processFilter(filter: string): FilterQuery<Pilot> {
    return this.parser.parse(filter);
  }

  getPilots(filter: FilterQuery<Pilot> = {}): Promise<PilotDocument[]> {
    return this.pilotModel.find(filter).exec();
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
    logger.debug('creating pilot with data %o', createData);

    try {
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
      ({
        initialBlock: pilot.vacdm.blockId,
        initialTtot: pilot.vacdm.ttot,
      } = await this.cdmService.determineInitialBlock(pilot));

      await this.cdmService.putPilotIntoBlock(pilot);
      await pilot.save();

      return pilot;
    } catch (error) {
      if (typeof error.message === 'string' && error.message.includes('duplicate key error')) {
        throw new ConflictException('Callsign already in use');
      }

      throw error;
    }
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

  async cleanupPilots() {
    // delete long inactive pilots
    const pilotsToBeDeleted = await this.getPilots({
      inactive: true,
      updatedAt: {
        $lte: new Date(
          Date.now() - getAppConfig().timeframes.timeSinceInactive,
        ).getTime(),
      },
    });

    logger.debug('pilotsToBeDeleted %o', pilotsToBeDeleted);

    for (const pilot of pilotsToBeDeleted) {
      this.deletePilot(pilot.callsign);
      logger.debug('deleted inactive pilot %o', pilot.callsign);
    }

    // deactivate long not seen pilots
    const pilotsToBeDeactivated = await this.getPilots({
      inactive: { $not: { $eq: true } },
      updatedAt: {
        $lt: new Date(
          Date.now() - getAppConfig().timeframes.timeSinceLastSeen,
        ).getTime(),
      },
    });

    logger.debug('pilotsToBeDeactivated %o', pilotsToBeDeactivated);

    for (const pilot of pilotsToBeDeactivated) {
      pilot.inactive = true;

      // await this.pilotService.addLog({
      //   pilot: pilot.callsign,
      //   namespace: 'worker',
      //   action: 'deactivated pilot',
      //   data: {
      //     updated: pilot.updatedAt,
      //   },
      // });

      logger.debug('deactivating pilot %o', pilot.callsign);

      await pilot.save();
    }
  }
}
