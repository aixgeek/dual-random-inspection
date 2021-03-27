import { Module } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { IndustryTypeService } from './industry-type.service';
import { IndustryTypeController } from './industry-type.controller';

@Module({
  controllers: [IndustryTypeController],
  providers: [IndustryTypeService, CloudBaseService],
})
export class IndustryTypeModule {}
