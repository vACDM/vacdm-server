import { Body, Controller, Get, Patch, Post } from '@nestjs/common';

import { PilotDto } from './pilot.dto';
import { PilotService } from './pilot.service';

@Controller('v1/pilots')
export class PilotController {
  constructor(
    private pilotService: PilotService,
  ) {}

  @Get('/')
  getAllPilots() {
    return this.pilotService.getAllPilots(); 
  }

  @Post('/')
  create(@Body() dto: PilotDto) {
    return this.pilotService.createPilot(dto);
  }

  @Patch('/')
  update(@Body() dto: PilotDto) {
    // return this.pilotService.createPilot(createDto);
    return dto;
  }

}
