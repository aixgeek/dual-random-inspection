import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { SupervisionAdministrationService } from './supervision-administration.service';

describe('SupervisionAdministrationService', () => {
  let service: SupervisionAdministrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupervisionAdministrationService, CloudBaseService],
    }).compile();

    service = module.get<SupervisionAdministrationService>(
      SupervisionAdministrationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
