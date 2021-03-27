import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { IndustryTypeService } from './industry-type.service';

describe('IndustryTypeService', () => {
  let service: IndustryTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndustryTypeService, CloudBaseService],
    }).compile();

    service = module.get<IndustryTypeService>(IndustryTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
