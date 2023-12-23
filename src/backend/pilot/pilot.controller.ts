import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { JoiPipe } from 'nestjs-joi';

import { PilotDto, PilotCallsignValidator } from './pilot.dto';
import { PilotService } from './pilot.service';

const joiPipeCallSign = new JoiPipe(PilotCallsignValidator.required());

@Controller('api/v1/pilots')
export class PilotController {
  constructor(
    private pilotService: PilotService,
  ) {}

  @Get('/')
  async getAllPilots() {
    const pilots = await this.pilotService.getAllPilots();
    
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
