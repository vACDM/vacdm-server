import { Controller, Get, Param, Res } from '@nestjs/common';
import dayjs from 'dayjs';
import { Response } from 'express';

import { AirportService } from '../airport/airport.service';
import getAppConfig from '../config';
import { PilotService } from '../pilot/pilot.service';
import { UtilsService } from '../utils/utils.service';

const { publicUrl } = getAppConfig();

@Controller('/api/vdgs')
export class VdgsController {
  constructor(
    private airportService: AirportService,
    private pilotService: PilotService,
    private utilsService: UtilsService,
  ) {}

  private setDateHeaders(res: Response, date: Date | void) {
    res.setHeader('Date', this.utilsService.formatDateForHeader());
    res.setHeader('Last-Modified', this.utilsService.formatDateForHeader(date));
  }

  @Get('/nool')
  async getNoolAirportList(@Res({ passthrough: true }) res: Response) {
    const airports = await this.airportService.getAllAirports();

    this.setDateHeaders(res);

    return {
      version: 1,
      airports: Object.fromEntries(airports.map(a => ([a.icao, [`${publicUrl}/api/vdgs/nool/${a.icao}`]]))),
    };
  }

  @Get('/nool/:icao')
  async getNoolAirport(@Res({ passthrough: true }) res: Response, @Param('icao') icao: string) {
    const flights = await this.pilotService.getPilots({ 'flightplan.adep': icao });

    this.setDateHeaders(res);

    return {
      version: 1,
      flights: flights.map(flight => ({
        lat: flight.position.lat,
        lon: flight.position.lon,
        callsign: flight.callsign,
        tobt: dayjs(flight.vacdm.tobt).format('HHmm'),
        tsat: dayjs(flight.vacdm.tsat).format('HHmm'),
        runway: flight.clearance.dep_rwy,
        sid: flight.clearance.sid,
      })),
    };
  }
}
