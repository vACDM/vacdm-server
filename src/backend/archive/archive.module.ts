import { Module, forwardRef } from '@nestjs/common';

import { DatabaseModule } from '../database.module';
import { PilotModule } from '../pilot/pilot.module';

import { ArchiveService } from './archive.service';
import { ArchivedPilotModelProvider } from './archivedPilot.model';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => PilotModule),
  ],
  providers: [ArchiveService, ArchivedPilotModelProvider],
  controllers: [],
  exports: [ArchiveService],
})
export class ArchiveModule {}
