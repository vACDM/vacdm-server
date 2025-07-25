import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import { EcfmpFilter } from '../../shared/interfaces/ecfmp.interface';
import { CdmService } from '../cdm/cdm.service';
import { EcfmpMeasureDocument } from '../ecfmp/ecfmp-measure.model';
import { EcfmpService } from '../ecfmp/ecfmp.service';
import { PilotDocument } from '../pilot/pilot.model';
import { PilotService } from '../pilot/pilot.service';
import { Schedule } from '../schedule/schedule.decorator';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class EtfmsService {
  constructor(
    private ecfmpService: EcfmpService,
    private pilotService: PilotService,
    private utilsService: UtilsService,
    private cdmService: CdmService,
  ) {}

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
        // pretend everything else matches pilot, so it behaves, as if the filter was not set asasa
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

  @Schedule({ nextJob: 'EtfmsService:handleMeasures' })
  async assignMeasuresToPilots() {
    const measures: EcfmpMeasureDocument[] = await this.ecfmpService.getMeasures();
    const pilots: PilotDocument[] = await this.pilotService.getPilots();

    const promises: Promise<unknown>[] = [];

    for (const pilot of pilots) {
      const measuresApplyingToPilot: EcfmpMeasureDocument[] = await this.getMeasuresApplyingToPilot(pilot, measures);

      pilot.measures = measuresApplyingToPilot.map(m => String(m._id));
      pilot.vacdm.suspended = measuresApplyingToPilot.some(m => m.measure.type === 'ground_stop');

      promises.push(pilot.save());
    }

    await Promise.allSettled(promises);
  }

  private async processMeasureMdi(measure: EcfmpMeasureDocument, pilots: PilotDocument[]) {
    if (
      (
        measure.measure.type !== 'average_departure_interval'
        && measure.measure.type !== 'minimum_departure_interval'
      ) || typeof measure.measure.value !== 'number'
    ) {
      return;
    }

    const { starttime, endtime } = measure;

    const interval = measure.measure.value * 1000;

    let lastTtot = -interval;

    function compare(pilot: PilotDocument): number {
      return pilot.vacdm.tobt.valueOf() + (pilot.vacdm.exot * 60000);
    }

    pilots.sort((p1, p2) => compare(p1) - compare(p2));

    for (const pilot of pilots) {
      if (pilot.vacdm.ttot < starttime || pilot.vacdm.ttot >= endtime) {
        continue;
      }

      const nextAllowableTtot = lastTtot + interval;

      // if space in block of nextAlloweableTtot and pilot able
      // da rein
      // else platz im block von pilot able
      // da rein

      const blockNextAllowableTtot = this.utilsService.getBlockFromTime(new Date(nextAllowableTtot));
      const blockPilotTobt = this.utilsService.getBlockFromTime(pilot.vacdm.tobt);

      if (
        pilot.vacdm.ttot.valueOf() < nextAllowableTtot
        || (
          pilot.vacdm.tobt.valueOf() <= (nextAllowableTtot - pilot.vacdm.exot * 60000)
          && await this.cdmService.isSpaceAvailInBlock(pilot.flightplan.adep, pilot.clearance.dep_rwy, blockNextAllowableTtot)
        )
      ) {
        if (nextAllowableTtot) {
          pilot.vacdm.ttot = new Date(nextAllowableTtot);
        }

        const newBlockId = this.utilsService.getBlockFromTime(pilot.vacdm.ttot);

        pilot.vacdm.blockId = newBlockId;
        pilot.vacdm.tsat = new Date(pilot.vacdm.ttot.valueOf() - pilot.vacdm.exot * 60000);

      } else if (
        pilot.vacdm.tobt.valueOf() >= (nextAllowableTtot - pilot.vacdm.exot * 60000)
        && await this.cdmService.isSpaceAvailInBlock(pilot.flightplan.adep, pilot.clearance.dep_rwy, blockPilotTobt)
      ) {
        pilot.vacdm.ttot = new Date(pilot.vacdm.tobt.valueOf() + pilot.vacdm.exot * 60000);

        pilot.vacdm.blockId = blockPilotTobt;
        pilot.vacdm.tsat = new Date(pilot.vacdm.ttot.valueOf() - pilot.vacdm.exot * 60000);
      }

      await this.cdmService.putPilotIntoBlock(pilot, nextAllowableTtot);

      // ttot also festtackern when no change is necessary
      pilot.vacdm.ctot = pilot.vacdm.ttot;
      await pilot.save();

      lastTtot = pilot.vacdm.ttot.valueOf();
    }
  }

  private async processMeasureGroundStop(measure: EcfmpMeasureDocument, pilots: PilotDocument[]) {
    const { endtime } = measure;

    const promises: Promise<unknown>[] = [];

    for (const pilot of pilots) {
      pilot.vacdm.ctot = endtime;
      pilot.vacdm.suspended = true;

      promises.push(pilot.save());
    }

    await Promise.allSettled(promises);
  }

  @Schedule({ nextJob: 'CdmService:optimizeBlockAssignments' })
  async handleMeasures() {
    const measures: EcfmpMeasureDocument[] = await this.ecfmpService.getMeasures();
    const pilots: PilotDocument[] = await this.pilotService.getPilots({
      measures: {
        $exists: true,
        $type: 'array',
        $ne: [],
      },
      inactive: false,
    });

    const promises: Promise<unknown>[] = [];

    for (const measure of measures) {
      const measureId = String(measure._id);

      switch (measure.measure.type) {
        case 'average_departure_interval':
        case 'minimum_departure_interval': {
          const pilotsThisMeasure = pilots.filter(p =>
            p.measures.includes(measureId) &&
            !p.vacdm.suspended,
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
