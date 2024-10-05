import { Inject, Injectable } from '@nestjs/common';
import Agenda from 'agenda';
import axios from 'axios';
import dayjs from 'dayjs';
import { FilterQuery } from 'mongoose';

import { EcfmpMeasure, EcfmpPlugin } from '../../shared/interfaces/ecfmp.interface';
import logger from '../logger';
import { AGENDA_PROVIDER } from '../schedule.module';

import { ECFMP_MEASURE_MODEL, EcfmpMeasureDocument, EcfmpMeasureModel } from './ecfmp-measure.model';

const jobNameEnsureMeasureCurrency = 'ECFMP_ensureMeasureCurrency';

@Injectable()
export class EcfmpService {
  constructor(
    @Inject(ECFMP_MEASURE_MODEL) private ecfmpMeasureModel: EcfmpMeasureModel,
    @Inject(AGENDA_PROVIDER) private agenda: Agenda,
  ) {
    this.agenda.define(jobNameEnsureMeasureCurrency, this.ensureMeasureCurrency.bind(this));
    this.agenda.every('1 minute', jobNameEnsureMeasureCurrency);
  }

  acceptedMeasureTypes = ['minimum_departure_interval', 'average_departure_interval', 'ground_stop', 'mandatory_route'];

  async getMeasures(query: FilterQuery<EcfmpMeasureDocument> = {}): Promise<EcfmpMeasureDocument[]> {
    const measures = await this.ecfmpMeasureModel.find(query);

    return measures;
  }

  private async fetchMeasuresFromEcfmp(): Promise<EcfmpMeasure[]> {
    const ecfmpUrl = 'https://flow-dev.ecfmp.net/api/v1/plugin';

    try {
      const ecfmpMeasures = await axios.get<EcfmpPlugin>(ecfmpUrl);

      return ecfmpMeasures.data.flow_measures;

    } catch (error) {
      logger.error('Error on retrieving Measures from ECFMP %o', error);
      throw error; 
    }
  }

  private isMeasureRelevant(measure: EcfmpMeasure): boolean {
    if (!this.acceptedMeasureTypes.includes(measure.measure.type)) {
      return false;
    }

    const now = new Date();

    if (measure.withdrawn_at && dayjs(measure.withdrawn_at).isBefore(now)) {
      return false;
    }

    if (dayjs(measure.endtime).isBefore(now)) {
      return false;
    }

    return true;
  }

  private async upsertMeasure(data: EcfmpMeasure): Promise<EcfmpMeasureDocument> {
    const measure = await this.ecfmpMeasureModel.findOneAndUpdate({
      id: data.id,
    }, {
      $set: {
        ident: data.ident,
        event_id: data.event_id,
        reason: data.reason,
        starttime: data.starttime,
        measure: data.measure,
        filters: data.filters,
        endtime: data.endtime,
        withdrawn_at: data.withdrawn_at,
      },
    }, {
      new: true,
      upsert: true,
    });

    return measure;
  }

  /**
   * ensure vacdm measure database is consistent with ecfmp api plugin endpoint
   * - fetches measures
   * - upserts measures into vacdm database
   * - clears all expired or deleted measures
   */
  private async ensureMeasureCurrency() {
    logger.verbose(`${jobNameEnsureMeasureCurrency} > running...`);

    try {
      const measures = await this.fetchMeasuresFromEcfmp();

      logger.debug(`${jobNameEnsureMeasureCurrency} > got %d measures from ecfmp`, measures.length);
  
      const promises: Promise<unknown>[] = [];
      const measureIds: number[] = [];
  
      const now = new Date();
  
      for (const measure of measures) {
        if (!this.isMeasureRelevant(measure)) {
          continue;
        }
  
        measureIds.push(measure.id);
        promises.push(this.upsertMeasure(measure));
      }

      logger.debug(`${jobNameEnsureMeasureCurrency} > encountered %d relevant measures, awaiting upsert...`, measureIds.length);
  
      await Promise.allSettled(promises);

      logger.debug(`${jobNameEnsureMeasureCurrency} > all measures upserted, deleting old or irrelevant...`);
  
      const { deletedCount } = await this.ecfmpMeasureModel.deleteMany({
        $or: [
          {
            id: { $nin: measureIds },
          }, {
            endtime: { $lt: now  },
          }, {
            $and: [
              { withdrawn_at: { $ne: null } },
              { withdrawn_at: { $lt: now } },
            ],
          },
        ],
      });

      logger.debug(`${jobNameEnsureMeasureCurrency} > deleted %d old or irrelevant measures`, deletedCount);
    } catch (error) {
      logger.warn(`${jobNameEnsureMeasureCurrency} > failed: %o`, this.ensureMeasureCurrency);
    }
  }
}
