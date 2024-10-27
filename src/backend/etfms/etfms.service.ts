import { Inject, Injectable } from '@nestjs/common';
import Agenda from 'agenda';
import dayjs from 'dayjs';

import { EcfmpFilter } from '../../shared/interfaces/ecfmp.interface';
import { CdmService } from '../cdm/cdm.service';
import { EcfmpMeasureDocument } from '../ecfmp/ecfmp-measure.model';
import { EcfmpService } from '../ecfmp/ecfmp.service';
import logger from '../logger';
import { PilotDocument } from '../pilot/pilot.model';
import { PilotService } from '../pilot/pilot.service';
import { AGENDA_PROVIDER } from '../schedule.module';
import { UtilsService } from '../utils/utils.service';

const jobNameAssignMeasuresToPilots = 'ETFMS_assignMeasuresToPilots';
const jobNameHandleMeasures = 'ETFMS_handleMeasures';

@Injectable()
export class EtfmsService {
  constructor(
    @Inject(AGENDA_PROVIDER) private agenda: Agenda,
    private ecfmpService: EcfmpService,
    private pilotService: PilotService,
    private utilsService: UtilsService,
    private cdmService: CdmService,
  ) {
    this.agenda.define(jobNameAssignMeasuresToPilots, this.assignMeasuresToPilots.bind(this));
    this.agenda.every('1 minute', jobNameAssignMeasuresToPilots);

    this.agenda.define(jobNameHandleMeasures, this.handleMeasures.bind(this));

    this.agenda.on(`success:${jobNameAssignMeasuresToPilots}`, () => this.agenda.now(jobNameHandleMeasures, {}));
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

  private async processMeasureMdi(measure: EcfmpMeasureDocument, pilots: PilotDocument[]) {
    if (typeof measure.measure.value !== 'number') {
      return;
    }

    const startTime = measure.starttime;

    const start = Math.floor(startTime.valueOf() / 1000);
    const end = Math.floor(measure.endtime.valueOf() / 1000);
    const interval = measure.measure.value;


  }

  private async processMeasureGroundStop(measure: EcfmpMeasureDocument, pilots: PilotDocument[]) {
    const { endtime } = measure;

    const promises: Promise<unknown>[] = [];

    const endtimeBlockId = this.utilsService.getBlockFromTime(endtime);

    for (const pilot of pilots) {
      pilot.vacdm.ctot = endtime;
      pilot.vacdm.suspended = true;

      const { blockId: oldBlockId } = pilot.vacdm;

      const additionalDelay = endtimeBlockId - oldBlockId;

      if (additionalDelay > 0) {
        pilot.vacdm.delay += additionalDelay;
      }

      promises.push(pilot.save());
    }

    await Promise.allSettled(promises);
  }

  private async handleMeasures() {
    const measures: EcfmpMeasureDocument[] = await this.ecfmpService.getMeasures();
    const pilots: PilotDocument[] = await this.pilotService.getPilots({
      measures: {
        $exists: true,
        $type: 'array',
        $ne: [],
      },
    });

    // TODO: cleanup <3

    const groundStopIds: string[] = measures.filter(m => m.measure.type === 'ground_stop').map(m => String(m._id));

    const promises: Promise<unknown>[] = [];

    for (const measure of measures) {
      const measureId = String(measure._id);

      switch (measure.measure.type) {
        case 'average_departure_interval':
        case 'minimum_departure_interval': {
          const pilotsThisMeasure = pilots.filter(p =>
            p.measures.includes(measureId) &&
            !p.measures.some(m => groundStopIds.includes(m)),
          );

          promises.push(this.processMeasureMdi(measure, pilotsThisMeasure));
          break;
        }

        case 'ground_stop': {
          const pilotsThisMeasure = pilots.filter(p => p.measures.includes(measureId));

          promises.push(this.processMeasureGroundStop(measure, pilotsThisMeasure));
          break;
        }
      }
    }

    await Promise.allSettled(promises);
  }

  async getRegulation(pilot: PilotDocument, loadMeasures = false): Promise<boolean> {
    if (loadMeasures) {
      const measures = await this.getMeasuresApplyingToPilot(pilot);

      pilot.measures = measures.map(m => String(m._id));

      await pilot.save();
    }

    return !!pilot.measures.length;
  }
}
