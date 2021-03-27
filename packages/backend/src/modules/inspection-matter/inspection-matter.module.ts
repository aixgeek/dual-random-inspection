import { Module } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { InspectionMatterService } from './inspection-matter.service';
import { InspectionMatterController } from './inspection-matter.controller';

@Module({
  controllers: [InspectionMatterController],
  providers: [InspectionMatterService, CloudBaseService],
})
export class InspectionMatterModule {}
