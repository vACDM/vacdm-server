import { Inject, Injectable, forwardRef } from '@nestjs/common';
import Agenda from 'agenda';
import dayjs from 'dayjs';

import { EcfmpFilter, EcfmpMeasure } from '../../shared/interfaces/ecfmp.interface';
import Pilot from '../../shared/interfaces/pilot.interface';
import { AirportService } from '../airport/airport.service';
import { EcfmpMeasureDocument } from '../ecfmp/ecfmp-measure.model';
import { EcfmpService } from '../ecfmp/ecfmp.service';
import logger from '../logger';
import { PilotDocument } from '../pilot/pilot.model';
import { PilotService } from '../pilot/pilot.service';
import { AGENDA_PROVIDER } from '../schedule.module';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class EtfmsService {
  constructor(
    @Inject(AGENDA_PROVIDER) private agenda: Agenda,
    @Inject(forwardRef(() => PilotService)) private pilotService: PilotService,
    @Inject(forwardRef(() => EcfmpService)) private ecfmpService: EcfmpService,
    @Inject(forwardRef(() => AirportService)) private airportService: AirportService,
    private utilsService: UtilsService,
  ) {
    this.agenda.define('ETFMS_manageMeasures', this.manageMeasures.bind(this));
    this.agenda.every('1 minute', 'ETFMS_manageMeasures');
  }

  private async isMeasureValidForPilot(
    pilot: Pilot,
    measure: EcfmpMeasureDocument,
  ) {
    const returnArray: boolean[] = [];
    const adepArray: boolean[] = [];
    const adesArray: boolean[] = [];
    
    measure.filters.forEach((filter: EcfmpFilter) => {
      switch (filter.type) {
        case 'ADEP':
  
          filter.value.forEach((element) => {
            const niceElement = element.replace(/\*/g, '.');
            const re = new RegExp(`${niceElement}`);
  
            if (re.test(pilot.flightplan.adep)) {
              adepArray.push(true);
            } else {
              adepArray.push(false);
            }
          });
          if (adepArray.some(Boolean)) {
            returnArray.push(true);
          } else {
            returnArray.push(false);
          }
          break;
  
        case 'ADES':
  
          filter.value.forEach((element) => {
            const niceElement = element.replace(/\*/g, '.');
            const re = new RegExp(`${niceElement}`);
  
            if (re.test(pilot.flightplan.ades)) {
              adesArray.push(true);
            } else {
              adesArray.push(false);
            }
          });
  
          if (adesArray.some(Boolean)) {
            returnArray.push(true);
          } else {
            returnArray.push(false);
          }
  
          break;
  
        // remove default when every case is catched
        default:
          returnArray.push(true);
          break;
      }
    });
  
    if (returnArray.every(Boolean)) {
      return true;
    }
  
    return false;
  }

  async manageMeasures() {
    const pilots: PilotDocument[] = await this.pilotService.getAllPilots();
    const measures: EcfmpMeasureDocument[] = await this.ecfmpService.getInternalMeasures();

    const measureIdentifiers: string[] = measures.map((m) => m.ident);

    for (const pilot of pilots) {
      

      for (const measure of measures) {
        if (
          dayjs(measure.starttime).isBefore(pilot.vacdm.ttot) &&
          dayjs(measure.endtime).isAfter(pilot.vacdm.ttot) &&
          (await this.isMeasureValidForPilot(pilot, measure)) &&
          measure.enabled &&
          !pilot.measures.find((e) => e.ident === measure.ident)
        ) {
          pilot.measures.push({
            ident: measure.ident,
            value: measure.measure.value,
          });

          logger.debug(`${measure.ident} assinged to ${pilot.callsign}`);
        }

        for (const [i, pilotMeasure] of pilot.measures.entries()) {
          if (
            !measureIdentifiers.includes(pilotMeasure.ident) ||
            !measure.enabled
          ) {
            pilot.measures.splice(i, 1);
          }
  
          logger.debug(`${pilotMeasure.ident} removed from ${pilot.callsign}`);
        }

        await pilot.save();
      }
    }
  }


  async slotCalculation() {
    const pilots: PilotDocument[] = await this.pilotService.getAllPilots();
    const measures: EcfmpMeasureDocument[] = await this.ecfmpService.getInternalMeasures();

    for (const measure of measures) {
      const pilotsWithSameMeasures = pilots.filter(
        (plt) =>
          plt.measures.find((e) => e.ident === measure.ident),
      );


      for (const pilot of pilotsWithSameMeasures) {
        if (
          !this.utilsService.isTimeEmpty(pilot.vacdm.tobt) ||
          this.utilsService.isTimeEmpty(pilot.vacdm.aobt)
        ) {
          
        }
      }
    }
  }

}



