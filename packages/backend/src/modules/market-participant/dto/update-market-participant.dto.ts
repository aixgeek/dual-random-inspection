import { PartialType } from '@nestjs/mapped-types';
import { CreateMarketParticipantDto } from './create-market-participant.dto';

export class UpdateMarketParticipantDto extends PartialType(
  CreateMarketParticipantDto,
) {}
