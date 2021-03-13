/*
 * @Author: June Lue
 * @Date: 2020-10-24 21:17:40
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 13:49:30
 * @FilePath: \VSCProjects\wanning-backend\src\modules\supervisionAdministration\supervisionAdministration.module.ts
 */
import { Module } from '@nestjs/common'
import { SupervisionAdministrationController } from './supervisionAdministration.controller'

@Module({
  controllers: [SupervisionAdministrationController],
})
export class SupervisionAdministrationModule { }
