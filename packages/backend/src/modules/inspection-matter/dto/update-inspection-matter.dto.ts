import { PartialType } from '@nestjs/mapped-types';
import { CreateInspectionMatterDto } from './create-inspection-matter.dto';

export class UpdateInspectionMatterDto extends PartialType(
  CreateInspectionMatterDto,
) {}
