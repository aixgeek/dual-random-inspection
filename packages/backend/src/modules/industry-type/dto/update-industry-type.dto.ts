import { PartialType } from '@nestjs/mapped-types';
import { CreateIndustryTypeDto } from './create-industry-type.dto';

export class UpdateIndustryTypeDto extends PartialType(CreateIndustryTypeDto) {}
