/*
 * @Author: June Lue
 * @Date: 2020-10-24 21:17:40
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 15:05:12
 * @FilePath: \VSCProjects\wanning-backend\src\modules\industryType\industryType.module.ts
 */
import { Module } from '@nestjs/common'
import { IndustryTypeController } from './industryType.controller'

@Module({
  controllers: [IndustryTypeController],
})
export class IndustryTypeModule { }
