/*
 * @Author: June Lue
 * @Date: 2020-10-24 21:17:40
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-24 21:31:10
 * @FilePath: \VSCProjects\wanning-backend\src\modules\lawEnforcementOfficial\lawEnforcementOfficial.module.ts
 */
import { Module } from '@nestjs/common'
import { LawEnforcementOfficialController } from './lawEnforcementOfficial.controller'

@Module({
  controllers: [LawEnforcementOfficialController],
})
export class LawEnforcementOfficialModule { }
