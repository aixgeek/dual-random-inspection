import { PartialType } from '@nestjs/mapped-types';
import { CreateLawEnforcementOfficialDto } from './create-law-enforcement-official.dto';

export class UpdateLawEnforcementOfficialDto extends PartialType(
  CreateLawEnforcementOfficialDto,
) {}
