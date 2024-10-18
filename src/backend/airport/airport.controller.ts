import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JoiPipe } from 'nestjs-joi';

import { AirportDto, AirportIcaoValidator } from './airport.dto';
import { AirportService } from './airport.service';

const joiPipeAirportIcao = new JoiPipe(AirportIcaoValidator.required());

@ApiTags('airports')
@Controller('api/v1/airports')
export class AirportController {
  constructor(
    private airportService: AirportService,
  ) {}

  @Get('/')
  async getAirports() {
    const airports = await this.airportService.getAllAirports();

    return {
      count: airports.length,
      airports: airports,
    };
  }

  @Get('/:icao')
  getAirport(@Param('icao', joiPipeAirportIcao) icao: string) {
    return this.airportService.getAirportFromIcao(icao);
  }

  @Get('/:icao/blocks')
  getAirportBlockUtilization(@Param('icao', joiPipeAirportIcao) icao: string, @Param('count') count: string) {
    let numberedCount: number | undefined = Number(count);

    if (Number.isNaN(numberedCount)) {
      numberedCount = undefined;
    }

    return this.airportService.getBlockUtilization(icao, numberedCount);
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
