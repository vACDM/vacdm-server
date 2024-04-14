import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { Parser } from 'peggy';

import { Region } from '../../shared/interfaces/region.interface';
import logger from '../logger';
import { UtilsService } from '../utils/utils.service';

import { REGION_MODEL, RegionDocument, RegionModel } from './region.model';

function determineParentCount(region: RegionDocument, allRegions: RegionDocument[]): number {
  if (!region.parent) {
    logger.debug('%s: no parent identifier', region.identifier);
    return 0;
  }

  
  logger.debug('%s: parent identifier: %s', region.identifier, region.parent);

  const parent = allRegions.find(r => r._id.toString() == region.parent?.toString());

  if (!parent) {
    logger.debug('%s: no parent with given identifier found', region.identifier);
    return 0;
  }

  
  logger.debug('%s: parent found: %s', region.identifier, parent.identifier);

  return determineParentCount(parent, allRegions) + 1;
}

@Injectable()
export class RegionService {
  constructor(
    @Inject(REGION_MODEL) private regionModel: RegionModel,
    private utilsService: UtilsService,

  ) {
    this.parser = this.utilsService.generateFilter({}, true);
  }

  private parser: Parser;

  processFilter(filter: string): FilterQuery<Region> {
    return this.parser.parse(filter);
  }

  getRegions(filter: FilterQuery<Region>): Promise<RegionDocument[]> {
    return this.regionModel.find(filter).exec();
  }

  getAllRegions(): Promise<RegionDocument[]> {
    return this.getRegions({});
  }

  async determineRegionForAirportIcao(airportIcao: string): Promise<RegionDocument | null> {
    const regions = await this.getAllRegions();

    const fittingRegions: {
      region: RegionDocument,
      parentCount: number,
    }[] = [];

    for (const region of regions) {
      if (region.airportPatterns.some(pattern => new RegExp(pattern).test(airportIcao))) {
        const parentCount = determineParentCount(region, regions);
        fittingRegions.push({ region, parentCount });
      }
    }

    logger.debug('fittingRegions: %o', fittingRegions);

    if (!fittingRegions.length) {
      return null;
    }

    fittingRegions.sort((a, b) => b.parentCount - a.parentCount);

    return fittingRegions[0].region;
  }
}
