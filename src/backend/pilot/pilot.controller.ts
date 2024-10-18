import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JoiPipe } from 'nestjs-joi';

import logger from '../logger';

import { PilotDto, PilotCallsignValidator } from './pilot.dto';
import { PilotService } from './pilot.service';

const joiPipeCallSign = new JoiPipe(PilotCallsignValidator('callsign').required());

@ApiTags('pilots')
@Controller('api/v1/pilots')
export class PilotController {
  constructor(
    private pilotService: PilotService,
  ) {}

  @Get('/')
  async getAllPilots(@Query('filter') filter = '') {
    let parsedFilter = {};

    if (filter) {
      try {
        parsedFilter = this.pilotService.processFilter(filter);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
      logger.debug('filter: %s - parsedFilter: %o', filter, parsedFilter);
    }

    const pilots = await this.pilotService.getPilots(parsedFilter);

    return {
      count: pilots.length,
      pilots: pilots,
    };
  }

  @Get('/:callsign')
  getPilot(@Param('callsign', joiPipeCallSign) callsign: string) {
    return this.pilotService.getPilotFromCallsign(callsign);
  }

  @Post('/')
  createPilot(@Body() dto: PilotDto) {
    return this.pilotService.createPilot(dto);
  }

  @Patch('/:callsign')
  updatePilot(@Param('callsign', joiPipeCallSign) callsign: string, @Body() dto: PilotDto) {
    return this.pilotService.updatePilot(callsign, dto);
  }

  @Delete('/:callsign')
  deletePilot(@Param('callsign', joiPipeCallSign) callsign: string) {
    return this.pilotService.deletePilot(callsign);
  }
}
