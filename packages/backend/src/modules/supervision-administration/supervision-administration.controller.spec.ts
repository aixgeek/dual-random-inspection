import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { SupervisionAdministrationController } from './supervision-administration.controller';
import { SupervisionAdministrationService } from './supervision-administration.service';

describe('SupervisionAdministrationController', () => {
  let controller: SupervisionAdministrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupervisionAdministrationController],
      providers: [SupervisionAdministrationService, CloudBaseService],
    }).compile();

    controller = module.get<SupervisionAdministrationController>(
      SupervisionAdministrationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
