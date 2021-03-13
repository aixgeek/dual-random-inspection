/*
 * @Author: June Lue
 * @Date: 2020-10-24 19:44:25
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-24 21:10:08
 * @FilePath: \VSCProjects\wanning-backend\src\modules\inspectionMatter\inspectionMatter.controller.ts
 */
import _ from 'lodash'
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator'
import { Controller, Get, Post, Request, Body, Query } from '@nestjs/common'
import { UnauthorizedOperation, RecordExistException } from '@/common'
import { CloudBaseService } from '@/services'
import { CollectionV2 } from '@/constants'

class InspectionMatter {
    dutyDepartment: string
    supervisionAdministration: string
}

@Controller('inspectionMatter')
export class InspectionMatterController {
    constructor(
        private readonly cloudbaseService: CloudBaseService
    ) { }

    @Get()
    async getInspectionMatters(
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
            .collection(CollectionV2.InspectionMatters)
            .where(filter)
            .skip(Number(current - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .get()

        let { total } = await this.cloudbaseService
            .collection(CollectionV2.InspectionMatters)
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
    async updateInspectionMatters(
        @Body() body: InspectionMatter,
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
            .collection(CollectionV2.InspectionMatters)
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