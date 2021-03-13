/*
 * @Author: June Lue
 * @Date: 2020-10-24 19:44:25
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-24 21:35:02
 * @FilePath: \VSCProjects\wanning-backend\src\modules\lawEnforcementOfficial\lawEnforcementOfficial.controller.ts
 */
import _ from 'lodash'
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator'
import { Controller, Get, Post, Request, Body, Query } from '@nestjs/common'
import { UnauthorizedOperation, RecordExistException } from '@/common'
import { CloudBaseService } from '@/services'
import { CollectionV2 } from '@/constants'

class LawEnforcementOfficial {
    supervisionAdministration: string
    dutyDepartment: string
}

@Controller('lawEnforcementOfficial')
export class LawEnforcementOfficialController {
    constructor(
        private readonly cloudbaseService: CloudBaseService
    ) { }

    @Get()
    async getLawEnforcementOfficials(
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
            .collection(CollectionV2.LawEnforcementOfficials)
            .where(filter)
            .skip(Number(current - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .get()

        let { total } = await this.cloudbaseService
            .collection(CollectionV2.LawEnforcementOfficials)
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

    @Post()
    async updateLawEnforcementOfficials(
        @Body() body: LawEnforcementOfficial,
        @Request() req: AuthRequest) {
        const { supervisionAdministration, dutyDepartment } = body

        // 可获取的所有监管单位列表
        const allSupervisionAdministrations = req.authUser.supervisionAdministrations
        const filter: any = {}
        if (!allSupervisionAdministrations?.some((_) => _ === '*')) {
            const $ = this.cloudbaseService.db.command
            filter.supervisionAdministration = $.in(allSupervisionAdministrations)
        }

        let { updated, requestId } = await this.cloudbaseService
            .collection(CollectionV2.LawEnforcementOfficials)
            .where(filter)
            .update(
                {
                    supervisionAdministration: supervisionAdministration,
                    dutyDepartment: dutyDepartment,
                }
            )

        return {
            requestId,
            updated
        }
    }
}