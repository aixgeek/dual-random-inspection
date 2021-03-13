/*
 * @Author: June Lue
 * @Date: 2020-10-24 21:17:40
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-24 21:42:22
 * @FilePath: \VSCProjects\wanning-backend\src\modules\MarketParticipant\marketParticipant.module.ts
 */
import { Module } from '@nestjs/common'
import { MarketParticipantController } from './marketParticipant.controller'

@Module({
  controllers: [MarketParticipantController],
})
export class MarketParticipantModule { }
