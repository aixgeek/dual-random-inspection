/*
 * @Author: June Lue
 * @Date: 2020-10-24 21:17:40
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 15:59:08
 * @FilePath: \VSCProjects\wanning-backend\src\modules\dutyDepartment\dutyDepartment.module.ts
 */
import { Module } from '@nestjs/common'
import { DutyDepartmentController } from './dutyDepartment.controller'

@Module({
  controllers: [DutyDepartmentController],
})
export class DutyDepartmentModule { }
