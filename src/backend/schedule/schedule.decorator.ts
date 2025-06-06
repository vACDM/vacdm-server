import { SetMetadata } from '@nestjs/common';

export const SCHEDULED_METADATA_KEY = 'custom:scheduled';

export type TScheduleOptions = {
  id: string;
  interval: string;
};

export function Schedule(options: TScheduleOptions): MethodDecorator {
  return SetMetadata(SCHEDULED_METADATA_KEY, options);
}
