import { ConflictException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import pointInPolygon from 'point-in-polygon';

import logger from '../logger';
import { PilotDocument } from '../pilot/pilot.model';
import { PilotService } from '../pilot/pilot.service';
import { UtilsService } from '../utils/utils.service';

import { AirportDto } from './airport.dto';
import { AIRPORT_MODEL, AirportDocument, AirportModel } from './airport.model';

import { AirportCapacity, AirportTaxizone } from '@/shared/interfaces/airport.interface';
import { AirportBlocks } from '@/shared/interfaces/pilot.interface';

@Injectable()
export class AirportService {
  constructor(
    @Inject(AIRPORT_MODEL) private airportModel: AirportModel,
    private utilsService: UtilsService,
    @Inject(forwardRef(() => PilotService)) private pilotService: PilotService,
  ) {}

  getAllAirports(): Promise<AirportDocument[]> {
    return this.airportModel.find({}).exec();
  }

  async getAirportFromId(id: string): Promise<AirportDocument> {
    logger.debug('trying to get an airport with id "%s"', id);
    const arpt = await this.airportModel.findById(id);
    
    if (!arpt) {
      logger.verbose('could not find airport with id "%s"', id);
      throw new NotFoundException();
    }
    
    return arpt;
  }

  async getAirportFromIcao(icao: string): Promise<AirportDocument> {
    logger.debug('trying to get an airport with icao "%s"', icao);
    const arpt = await this.airportModel.findOne({ icao });
    
    if (!arpt) {
      logger.verbose('could not find airport with icao "%s"', icao);
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

  async deleteAirport(icao: string): Promise<AirportDocument> {
    logger.verbose('deleting airport "%s"', icao);
    
    const arpt = await this.airportModel.findOneAndRemove({ icao });
    
    if (!arpt) {
      throw new NotFoundException();
    }

    return arpt;
  }

  async updateAirport(icao: string, diff: Partial<AirportDto>): Promise<AirportDocument> {
    const diffOps = this.utilsService.getDiffOps(diff);

    const arpt = await this.airportModel.findOneAndUpdate({ icao }, { $set: diffOps }, { new: true });

    if (!arpt) {
      throw new NotFoundException();
    }

    return arpt;
  }

  async getCapacityForRwyDesignator(icao: string, rwyDesignator: string): Promise<AirportCapacity> {
    const airport = await this.getAirportFromIcao(icao);

    const capacity = airport.capacities.find(c => [c.alias, c.rwy_designator].includes(rwyDesignator));

    if (!capacity) {
      throw new NotFoundException();
    }

    return capacity;
  }

  async determineRunway(pilot: PilotDocument): Promise<string> {
    const icao = pilot.flightplan.adep;
    const rwy = pilot.clearance.dep_rwy;

    const cap = await this.getCapacityForRwyDesignator(icao, rwy);

    return cap.alias || cap.rwy_designator;
  }

  async getKnownAirportIcaos(): Promise<string[]> {
    try {
      const airports = await this.getAllAirports();
      return airports.map(arpt => arpt.icao);
    } catch (error) {
      // explicitly return empty array on error
      // because plugin uses this to distribute requests
      return [];
    }
  }

  async determineTaxizone(pilot: PilotDocument): Promise<{ taxizone: string; exot: number; taxiout: boolean }> {
    const icao = pilot.flightplan.adep;
    const rwy = pilot.clearance.dep_rwy;

    const airport = await this.getAirportFromIcao(icao);

    const defaultTaxiZone = {
      taxizone: 'default taxitime',
      exot: airport.standard_taxitime,
      taxiout: false,
    };

    const pilotPos = [pilot.position.lat, pilot.position.lon];
    let taxizone: AirportTaxizone | undefined = undefined;

    for (const tz of airport.taxizones) {
      const poly = this.utilsService.convertScopeCoordsToLatLonPairs(tz.polygon);

      if (pointInPolygon(pilotPos, poly)) {
        taxizone = tz;
        break;
      }
    }

    if (!taxizone) {
      return defaultTaxiZone;
    }

    const timeDefinition = taxizone.taxitimes.find(d => d.rwy_designator == rwy);

    if (!timeDefinition) {
      return defaultTaxiZone;
    }

    return {
      taxizone: taxizone.label,
      exot: timeDefinition.minutes,
      taxiout: taxizone.taxiout,
    };
  }

  // TODO: refactor this to aggregation at some point
  async getBlockUtilization(icao: string): Promise<AirportBlocks> {
    const airport = await this.getAirportFromIcao(icao);

    const blocks: AirportBlocks = {
      icao,
      rwys: {},
    };

    for (const cap of airport.capacities) {
      const rwyDesignator = cap.alias || cap.rwy_designator;

      blocks.rwys[rwyDesignator] = Object.fromEntries(Array(144).fill(null).map((_, i) => [i, []]));
    }

    const pilots = await this.pilotService.getPilots({
      'vacdm.blockId': { $not: { $eq: -1 } },
      'flightplan.departure': icao,
    });

    for (const pilot of pilots) {
      const { blockRwyDesignator: blockRwyDesignator, blockId } = pilot.vacdm;
      blocks.rwys[blockRwyDesignator][blockId].push(pilot);
    }

    return blocks;
  }
}
