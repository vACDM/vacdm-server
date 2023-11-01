import { Body, Controller, Delete, Get, NotImplementedException, Param, Patch, Post } from '@nestjs/common';
import { JoiPipe } from 'nestjs-joi';

import { AirportDto, AirportIcaoValidator } from './airport.dto';
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
  getAirport(@Param('icao', new JoiPipe(AirportIcaoValidator.required())) icao: string) {
    return this.airportService.getAirportFromIcao(icao);
  }

  @Post('/')
  addAirport(@Body() dto: AirportDto) {
    return this.airportService.createAirport(dto);
  }

  @Patch('/:icao')
  updateAirport(@Param('icao', new JoiPipe(AirportIcaoValidator.required())) icao: string, @Body() dto: AirportDto) {
    throw new NotImplementedException();
  }

  @Delete('/:icao')
  deleteAirport(@Param('icao', new JoiPipe(AirportIcaoValidator.required())) icao: string) {
    return this.airportService.deleteAirport(icao);
  }
}
