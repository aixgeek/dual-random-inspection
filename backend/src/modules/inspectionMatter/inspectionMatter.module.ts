/*
 * @Author: June Lue
 * @Date: 2020-10-24 19:44:20
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-24 21:31:21
 * @FilePath: \VSCProjects\wanning-backend\src\modules\inspectionMatter\inspectionMatter.module.ts
 */
import { Module } from '@nestjs/common'
import { InspectionMatterController } from './inspectionMatter.controller'

@Module({
  controllers: [InspectionMatterController],
})
export class InspectionMatterModule { }
