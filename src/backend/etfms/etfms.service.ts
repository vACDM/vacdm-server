import { Inject, Injectable } from '@nestjs/common';
import Agenda from 'agenda';
import dayjs from 'dayjs';

import { EcfmpFilter } from '../../shared/interfaces/ecfmp.interface';
import { EcfmpMeasureDocument } from '../ecfmp/ecfmp-measure.model';
import { EcfmpService } from '../ecfmp/ecfmp.service';
import logger from '../logger';
import { PilotDocument } from '../pilot/pilot.model';
import { PilotService } from '../pilot/pilot.service';
import { AGENDA_PROVIDER } from '../schedule.module';

const jobNameAssignMeasuresToPilots = 'ETFMS_assignMeasuresToPilots';

@Injectable()
export class EtfmsService {
  constructor(
    @Inject(AGENDA_PROVIDER) private agenda: Agenda,
    private ecfmpService: EcfmpService,
    private pilotService: PilotService,
  ) {
    this.agenda.define(jobNameAssignMeasuresToPilots, this.assignMeasuresToPilots.bind(this));
    this.agenda.every('1 minute', jobNameAssignMeasuresToPilots);
  }

  private stringAirportMatcher(pilotField: string, measureValue: string): boolean {
    const regexifiedValue = measureValue.replace(/\*/g, '.');
    const regex = new RegExp(`^${regexifiedValue}$`, 'i');
    return regex.test(pilotField);
  }

  private executeMeasureFilter(pilot: PilotDocument, filter: EcfmpFilter): boolean {
    switch (filter.type) {
      case 'ADEP': {
        return filter.value.some(val => this.stringAirportMatcher(pilot.flightplan.adep, val));
      }
      case 'ADES': {
        return filter.value.some(val => this.stringAirportMatcher(pilot.flightplan.ades, val));
      }
      default: {
        // disregard every other filter
        // pretend everything else matches pilot, so it behaves, as if the filter was not set
        return true;
      }
    }
  }

  private doesMeasureApplyToPilot(pilot: PilotDocument, measure: EcfmpMeasureDocument): boolean {
    if (!measure.enabled) {
      return false;
    }

    if (
      dayjs(measure.starttime).isAfter(new Date(pilot.vacdm.ttot)) ||
      dayjs(measure.endtime).isBefore(new Date(pilot.vacdm.ttot))
    ) {
      return false;
    }

    if (measure.filters.some(f => !this.executeMeasureFilter(pilot, f))) {
      return false;
    }

    return true;
  }

  private async getMeasuresApplyingToPilot(pilot: PilotDocument, allMeasures?: EcfmpMeasureDocument[]): Promise<EcfmpMeasureDocument[]> {
    if (!allMeasures) {
      allMeasures = await this.ecfmpService.getMeasures();
    }

    const applyingMeasures = allMeasures.filter(measure => this.doesMeasureApplyToPilot(pilot, measure));

    return applyingMeasures;
  }

  private async assignMeasuresToPilots() {
    logger.verbose(`${jobNameAssignMeasuresToPilots} > running...`);

    try {
      const measures: EcfmpMeasureDocument[] = await this.ecfmpService.getMeasures();
      const pilots: PilotDocument[] = await this.pilotService.getPilots();

      const promises: Promise<unknown>[] = [];

      for (const pilot of pilots) {
        const measuresApplyingToPilot: EcfmpMeasureDocument[] = await this.getMeasuresApplyingToPilot(pilot, measures);

        pilot.measures = measuresApplyingToPilot.map(m => String(m._id));

        promises.push(pilot.save());
      }

      await Promise.allSettled(promises);
    } catch (error) {
      logger.error(`${jobNameAssignMeasuresToPilots} > failed: %o`, error);
    }
  }

  async isRegulated(pilot: PilotDocument): Promise<boolean> {
    return false;
  }

  async gimmeCtot(pilot: PilotDocument): Promise<Date | null> {
    return null;
  }
}
