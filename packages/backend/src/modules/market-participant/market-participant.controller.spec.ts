import { Test, TestingModule } from '@nestjs/testing';
import { CloudBaseService } from '@/services';
import { MarketParticipantController } from './market-participant.controller';
import { MarketParticipantService } from './market-participant.service';

describe('MarketParticipantController', () => {
  let controller: MarketParticipantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketParticipantController],
      providers: [MarketParticipantService, CloudBaseService],
    }).compile();

    controller = module.get<MarketParticipantController>(
      MarketParticipantController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
