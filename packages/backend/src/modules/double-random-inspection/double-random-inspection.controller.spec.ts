import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { MarketParticipantService } from '@/modules/market-participant/market-participant.service';
import { LawEnforcementOfficialService } from '@/modules/law-enforcement-official/law-enforcement-official.service';
import { DoubleRandomInspectionController } from './double-random-inspection.controller';
import { DoubleRandomInspectionService } from './double-random-inspection.service';

describe('DoubleRandomInspectionController', () => {
  let controller: DoubleRandomInspectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoubleRandomInspectionController],
      providers: [
        DoubleRandomInspectionService,
        CloudBaseService,
        MarketParticipantService,
        LawEnforcementOfficialService,
      ],
    }).compile();

    controller = module.get<DoubleRandomInspectionController>(
      DoubleRandomInspectionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
