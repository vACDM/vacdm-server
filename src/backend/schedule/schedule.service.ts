import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import ms from 'ms';

import logger from '../logger';

import { SCHEDULED_METADATA_KEY, TScheduleOptions } from './schedule.decorator';
import { SCHEDULE_MODEL, ScheduleDocument, ScheduleModel } from './schedule.model';

interface IJobMapProperties {
  method: () => void;
  instance: unknown,
  nextJob: string[];
  interval?: number;
}

@Injectable()
export class ScheduleService implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    @Inject(SCHEDULE_MODEL) private readonly scheduleModel: ScheduleModel,
  ) {}

  private jobMap: Map<string, IJobMapProperties> = new Map();

  onModuleInit() {
    logger.info('Loading scheduled methods...');

    const providers = this.discoveryService.getProviders();

    for (const wrapper of providers) {
      const { instance, name: wrapperName } = wrapper;

      if (!instance) continue;

      const prototype = Object.getPrototypeOf(instance);

      const methods = this.metadataScanner.getAllMethodNames(prototype);

      for (const methodName of methods) {
        const methodRef = prototype[methodName];
        const scheduledOptions: TScheduleOptions = this.reflector.get(SCHEDULED_METADATA_KEY, methodRef);

        if (!scheduledOptions) {
          continue;
        }

        const id = `${wrapperName}:${methodName}`;
        const properties: IJobMapProperties = {
          method: methodRef,
          instance,
          nextJob: !scheduledOptions.nextJob ? [] : Array.isArray(scheduledOptions.nextJob) ? scheduledOptions.nextJob : [scheduledOptions.nextJob],
          interval: scheduledOptions.interval ? ms(scheduledOptions.interval) : undefined,
        };

        this.jobMap.set(id, properties);

        logger.info('Loaded scheduled method {%s, %s, [%s]}', id, properties.interval, properties.nextJob.join(', '));
      }
    }

    for (const [jobId, job] of this.jobMap.entries()) {
      if (job.nextJob.some(id => !this.jobMap.has(id))) {
        throw new Error(`Failed to resolve Next job for job "${jobId}": job "${job.nextJob}" does not exist`);
      }

      this.upsertJob(jobId, job.interval);
    }

    logger.info('Loaded scheduled methods');

    setInterval(() => this.check(), ms('5 seconds'));
  }

  private async findJobToDo(): Promise<string | null> {
    const job = await this.scheduleModel.findOneAndUpdate({
      id: { $in: [...this.jobMap.keys()] },
      $and: [
        {
          $or: [
            { nextRun: { $lt: new Date() } },
            { nextRun: { $exists: false }, interval: { $exists: true } },
          ],
        },
        {
          $or: [
            { lockedAt: { $exists: false } },
            { lockedAt: null },
            { lockedAt: { $lt: new Date(Date.now() - (60000 * 2)) } },
          ],
        },
      ],
    }, {
      $set: {
        lockedAt: new Date(),
      },
    }, {
      new: true,
    }).exec();

    return job?.id;
  }

  private upsertJob(scheduleId: string, interval?: number): Promise<ScheduleDocument | null> {
    return this.scheduleModel.findOneAndUpdate({
      id: scheduleId,
    }, {
      $set: {
        interval,
      },
    }, {
      upsert: true,
      new: true,
    }).exec();
  }

  async queue(jobId: string, interval = 0): Promise<void> {
    await this.scheduleModel.updateOne({
      id: jobId,
    }, {
      $set: {
        lockedAt: null,
        nextRun: interval === -1 ? null : new Date(Date.now() + interval),
      },
    }).exec();
  }

  private async check(): Promise<void> {
    logger.silly('schedule: check');

    const jobToExecute = await this.findJobToDo();

    if (!jobToExecute) return;

    await this.executeMethod(jobToExecute);
  }

  private async executeMethod(jobToExecute: string) {
    logger.verbose('schedule: running %s', jobToExecute);
    const job = this.jobMap.get(jobToExecute);

    if (!job) {
      return;
    }

    try {
      await job.method.bind(job.instance)();

      logger.verbose('schedule: finished %s', jobToExecute);

      await this.queue(jobToExecute, job.interval ?? -1);

      for (const nextJob of job.nextJob) {
        await this.queue(nextJob);
      }
    } catch (error) {
      logger.warn('schedule: failed %s: %o', jobToExecute, error);
    }
  }
}
