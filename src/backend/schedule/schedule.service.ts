import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';

import logger from '../logger';

import { SCHEDULED_METADATA_KEY, TScheduleOptions } from './schedule.decorator';

export interface IScheduleRunDetails {}

@Injectable()
export class ScheduleService implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    // private readonly userService: UserService, // This can be any DB service
  ) {}

  private methodMap: Map<string, { method: (details: IScheduleRunDetails) => void }> = new Map();

  onModuleInit() {
    logger.info('Loading scheduled methods');

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

        logger.info('Loaded scheduled method %s/%s', wrapperName, methodName);
      }
    }

    logger.info('Loaded scheduled methods');
  }

  private check() {}

  private executeMethod(methodId: string) {}
}
