import { Module } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { DutyDepartmentService } from './duty-department.service';
import { DutyDepartmentController } from './duty-department.controller';

@Module({
  controllers: [DutyDepartmentController],
  providers: [DutyDepartmentService, CloudBaseService],
})
export class DutyDepartmentModule {}
