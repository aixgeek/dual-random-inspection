/*
 * @Author: June Lue
 * @Date: 2020-10-24 21:17:40
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 17:17:41
 * @FilePath: \VSCProjects\wanning-backend\src\modules\doubleRandomInspection\doubleRandomInspection.module.ts
 */
import { Module } from '@nestjs/common'
import { DoubleRandomInspectionController } from './doubleRandomInspection.controller'

@Module({
  controllers: [DoubleRandomInspectionController],
})
export class DoubleRandomInspectionModule { }
