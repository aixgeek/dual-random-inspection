import { PartialType } from '@nestjs/mapped-types';
import { CreateDoubleRandomResultDto } from './create-double-random-result.dto';

export class UpdateDoubleRandomResultDto extends PartialType(
  CreateDoubleRandomResultDto,
) {}
