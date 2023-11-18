import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import Joi from 'joi';
import { JoiPipe } from 'nestjs-joi';

import { PilotDto, PilotCallsignValidator } from './pilot.dto';
import { PilotService } from './pilot.service';

const joiPipecallSign = new JoiPipe(PilotCallsignValidator.required());

@Controller('api/v1/pilots')
export class PilotController {
  constructor(
    private pilotService: PilotService,
  ) {}

  @Get('/')
  getAllPilots() {
    return this.pilotService.getAllPilots(); 
  }

  @Get('/:callsign')
  getPilot(@Param('callsign', joiPipecallSign) callsign: string) {
    return this.pilotService.getPilotFromCallsign(callsign);
  }

  @Post('/')
  createPilot(@Body() dto: PilotDto) {
    return this.pilotService.createPilot(dto);
  }

  @Patch('/:callsign')
  updatePilot(@Param('callsign', joiPipecallSign) callsign: string, @Body() dto: PilotDto) {
    return this.pilotService.updatePilot(callsign, dto);
  }

  @Delete('/:callsign')
  deletePilot(@Param('callsign', joiPipecallSign) callsign: string) {
    return this.pilotService.deletePilot(callsign);
  }
}
