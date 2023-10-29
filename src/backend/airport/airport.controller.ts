import { Controller, Get, Param } from '@nestjs/common';

import { AirportService } from './airport.service';

@Controller('v1/airports')
export class AirportController {
  constructor(
    private airportService: AirportService,
  ) {}

  @Get('/')
  getAirports() {
    return this.airportService.getAllAirports();
  }
  
  @Get('/:icao')
  getAirport(@Param('icao') icao: string) {
    return this.airportService.getAirportFromIcao(icao);
  }
}
