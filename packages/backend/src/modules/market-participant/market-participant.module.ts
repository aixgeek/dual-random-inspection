import { Module } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { MarketParticipantService } from './market-participant.service';
import { MarketParticipantController } from './market-participant.controller';

@Module({
  controllers: [MarketParticipantController],
  providers: [MarketParticipantService, CloudBaseService],
})
export class MarketParticipantModule {}
