import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { LawEnforcementOfficialController } from './law-enforcement-official.controller';
import { LawEnforcementOfficialService } from './law-enforcement-official.service';

describe('LawEnforcementOfficialController', () => {
  let controller: LawEnforcementOfficialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LawEnforcementOfficialController],
      providers: [LawEnforcementOfficialService, CloudBaseService],
    }).compile();

    controller = module.get<LawEnforcementOfficialController>(
      LawEnforcementOfficialController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
