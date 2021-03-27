import { Module } from '@nestjs/common';
import { LawEnforcementOfficialService } from '@/modules/law-enforcement-official/law-enforcement-official.service';
import { MarketParticipantService } from '@/modules/market-participant/market-participant.service';
import { DoubleRandomInspectionService } from './double-random-inspection.service';
import { DoubleRandomInspectionController } from './double-random-inspection.controller';

@Module({
  controllers: [DoubleRandomInspectionController],
  providers: [
    DoubleRandomInspectionService,
    MarketParticipantService,
    LawEnforcementOfficialService,
  ],
})
export class DoubleRandomInspectionModule {}
