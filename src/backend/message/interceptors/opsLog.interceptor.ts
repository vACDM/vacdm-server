import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';

import { EOpLogType } from '../../../shared/interfaces/pilot.interface';
import { PilotService } from '../../pilot/pilot.service';

@Injectable()
export class PilotLoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly pilotService: PilotService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(async () => {
        await this.pilotService.addOperationalLog(
          req.body.callsign,
          {
            logType: EOpLogType.Incoming,
            event: req.body.messageType,
            content: JSON.stringify(req.body),
          },
        );

      }),
    );
  }
}
