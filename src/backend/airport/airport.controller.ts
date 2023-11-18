import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { JoiPipe } from 'nestjs-joi';

import { AirportDto, AirportIcaoValidator } from './airport.dto';
import { AirportService } from './airport.service';

const joiPipeAirportIcao = new JoiPipe(AirportIcaoValidator.required());

@Controller('api/v1/airports')
export class AirportController {
  constructor(
    private airportService: AirportService,
  ) {}

  @Get('/')
  getAirports() {
    return this.airportService.getAllAirports();
  }
  
  @Get('/:icao')
  getAirport(@Param('icao', joiPipeAirportIcao) icao: string) {
    return this.airportService.getAirportFromIcao(icao);
  }

  @Post('/')
  addAirport(@Body() dto: AirportDto) {
    return this.airportService.createAirport(dto);
  }

  @Patch('/:icao')
  updateAirport(@Param('icao', joiPipeAirportIcao) icao: string, @Body() dto: AirportDto) {
    return this.airportService.updateAirport(icao, dto);
  }

  @Delete('/:icao')
  deleteAirport(@Param('icao', joiPipeAirportIcao) icao: string) {
    return this.airportService.deleteAirport(icao);
  }
}
