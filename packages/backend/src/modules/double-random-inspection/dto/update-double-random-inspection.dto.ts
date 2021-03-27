import { PartialType } from '@nestjs/mapped-types';
import { CreateDoubleRandomInspectionDto } from './create-double-random-inspection.dto';

export class UpdateDoubleRandomInspectionDto extends PartialType(
  CreateDoubleRandomInspectionDto,
) {}
