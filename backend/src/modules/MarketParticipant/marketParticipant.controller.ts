/*
 * @Author: June Lue
 * @Date: 2020-10-24 19:44:25
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-24 21:47:01
 * @FilePath: \VSCProjects\wanning-backend\src\modules\MarketParticipant\marketParticipant.controller.ts
 */
import _ from 'lodash'
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator'
import { Controller, Get, Post, Request, Body, Query } from '@nestjs/common'
import { UnauthorizedOperation, RecordExistException } from '@/common'
import { CloudBaseService } from '@/services'
import { CollectionV2 } from '@/constants'

class MarketParticipant {
    supervisionAdministration: string
    industryType: string
    dutyDepartment: string
}

@Controller('marketParticipant')
export class MarketParticipantController {
    constructor(
        private readonly cloudbaseService: CloudBaseService
    ) { }

    @Get()
    async getMarketParticipants(
        @Query() query: { current?: number; pageSize?: number } = {},
        @Request() req: AuthRequest) {
        const { current = 1, pageSize = 20 } = query

        // 可获取的所有监管单位列表
        const allSupervisionAdministrations = req.authUser.supervisionAdministrations
        const filter: any = {}
        if (!allSupervisionAdministrations?.some((_) => _ === '*')) {
            const $ = this.cloudbaseService.db.command
            filter.supervisionAdministration = $.in(allSupervisionAdministrations)
        }

        let { data, requestId } = await this.cloudbaseService
            .collection(CollectionV2.MarketParticipants)
            .where(filter)
            .skip(Number(current - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .get()

        let { total } = await this.cloudbaseService
            .collection(CollectionV2.MarketParticipants)
            .where(filter)
            .count()

        return {
            requestId,
            data,
            total,
            success: true,
            pageSize,
            current: parseInt(`${current}`, 10) || 1,
        }
    }

    @Get('find')
    async findMarketParticipant(
        @Query() query: { info: string },
        @Request() req: AuthRequest) {
        const { info } = query

        const filter = { 'name': info }

        let { data, requestId } = await this.cloudbaseService
            .collection(CollectionV2.MarketParticipants)
            .where(filter)
            .get()

        return {
            requestId,
            data: data.shift(),
            success: true,
        }
    }

    @Post()
    async updateMarketParticipants(
        @Body() body: MarketParticipant,
        @Request() req: AuthRequest) {
        const { supervisionAdministration, industryType, dutyDepartment } = body

        // 可获取的所有监管单位列表
        const allSupervisionAdministrations = req.authUser.supervisionAdministrations
        const filter: any = {}
        if (!allSupervisionAdministrations?.some((_) => _ === '*')) {
            const $ = this.cloudbaseService.db.command
            filter.supervisionAdministration = $.in(allSupervisionAdministrations)
        }

        let { updated, requestId } = await this.cloudbaseService
            .collection(CollectionV2.MarketParticipants)
            .where(filter)
            .update(
                {
                    supervisionAdministration: supervisionAdministration,
                    industryType: industryType,
                    dutyDepartment: dutyDepartment,
                }
            )

        return {
            requestId,
            updated
        }
    }
}