import { PartialType } from '@nestjs/mapped-types';
import { CreateSupervisionAdministrationDto } from './create-supervision-administration.dto';

export class UpdateSupervisionAdministrationDto extends PartialType(
  CreateSupervisionAdministrationDto,
) {}
