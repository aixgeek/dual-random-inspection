import { Module } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { LawEnforcementOfficialService } from './law-enforcement-official.service';
import { LawEnforcementOfficialController } from './law-enforcement-official.controller';

@Module({
  controllers: [LawEnforcementOfficialController],
  providers: [LawEnforcementOfficialService, CloudBaseService],
})
export class LawEnforcementOfficialModule {}
