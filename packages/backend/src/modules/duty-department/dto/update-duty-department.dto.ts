import { PartialType } from '@nestjs/mapped-types';
import { CreateDutyDepartmentDto } from './create-duty-department.dto';

export class UpdateDutyDepartmentDto extends PartialType(
  CreateDutyDepartmentDto,
) {}
