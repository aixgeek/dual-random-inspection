import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { DoubleRandomResultController } from './double-random-result.controller';
import { DoubleRandomResultService } from './double-random-result.service';

describe('DoubleRandomResultController', () => {
  let controller: DoubleRandomResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoubleRandomResultController],
      providers: [DoubleRandomResultService, CloudBaseService],
    }).compile();

    controller = module.get<DoubleRandomResultController>(
      DoubleRandomResultController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
