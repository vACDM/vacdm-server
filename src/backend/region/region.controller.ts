import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';

import logger from '../logger';

import { RegionService } from './region.service';

@Controller('/api/v1/region')
export class RegionController {
  constructor(
    private regionService: RegionService,
  ) {}

  @Get('/')
  async getAllRegions(@Query('filter') filter = '') {
    let parsedFilter = {};

    if (filter) {
      try {
        parsedFilter = this.regionService.processFilter(filter);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
      logger.debug('filter: %s - parsedFilter: %o', filter, parsedFilter);
    }

    return this.regionService.getAllRegions();
  }

  @Get('/for/:icao')
  async getRegionForAirportIcao(@Param('icao') icao: string) {
    logger.debug(icao);

    const region = await this.regionService.determineRegionForAirportIcao(icao);

    return { region };
  }
}
