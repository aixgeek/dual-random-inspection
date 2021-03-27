import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { IndustryTypeController } from './industry-type.controller';
import { IndustryTypeService } from './industry-type.service';

describe('IndustryTypeController', () => {
  let controller: IndustryTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndustryTypeController],
      providers: [IndustryTypeService, CloudBaseService],
    }).compile();

    controller = module.get<IndustryTypeController>(IndustryTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
