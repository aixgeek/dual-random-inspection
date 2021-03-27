import { Module } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { DoubleRandomResultService } from './double-random-result.service';
import { DoubleRandomResultController } from './double-random-result.controller';

@Module({
  controllers: [DoubleRandomResultController],
  providers: [DoubleRandomResultService, CloudBaseService],
})
export class DoubleRandomResultModule {}
