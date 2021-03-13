import { Module } from '@nestjs/common'
import { DoubleRandomResultController } from './doubleRandomResult.controller'

@Module({
  controllers: [DoubleRandomResultController],
})
export class DoubleRandomResultModule { }
