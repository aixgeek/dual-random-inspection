import _ from 'lodash'
import { Controller, Get, Post, Request, Body, Query, Param } from '@nestjs/common'
import { CloudBaseService } from '@/services'
import { CollectionV2, Public } from '@/constants'

class DoubleRandomResult {
    _id: string
    dutyDepartment: string
    industryType: string
    inspectedAt: string
    inspectionMatter: string
    personCount: number
    supervisionAdministration: string
    inspectionAmount: number
    marketParticipant: string
    lawEnforcementOfficial: string
    status: number
    desc: string
}

@Controller('doubleRandomResult')
export class DoubleRandomResultController {
    constructor(
        private readonly cloudbaseService: CloudBaseService
    ) { }

    @Get('open')
    @Public()
    async getDoubleRandomResultsInOpen(
        @Query() query: { current?: number; pageSize?: number; id: string },
        @Request() req: AuthRequest) {
        const { current = 1, pageSize = 20, id } = query

        let { data, requestId } = await this.cloudbaseService
            .collection(CollectionV2.DoubleRandomResults)
            .orderBy('createdAt', 'desc')
            .skip(Number(current - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .get()

        data.map(d => {
            d.inspectionMatter = d.inspectionMatter.toString()
        })

        let { total } = await this.cloudbaseService
            .collection(CollectionV2.DoubleRandomResults)
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

    @Get()
    async getDoubleRandomResultsById(
        @Query() query: { current?: number; pageSize?: number; id: string },
        @Request() req: AuthRequest) {
        const { current = 1, pageSize = 20, id } = query

        // 可获取的所有监管单位列表
        const $ = this.cloudbaseService.db.command
        const filter: any = {}
        const allSupervisionAdministrations = req.authUser.supervisionAdministrations
        if (!allSupervisionAdministrations?.some((_) => _ === '*')) {
            filter.supervisionAdministration = $.in(allSupervisionAdministrations)
        }
        const allDoubleRandomInspections = []
        allDoubleRandomInspections.push(id)
        filter.doubleRandomInspection = $.in(allDoubleRandomInspections)

        let { data, requestId } = await this.cloudbaseService
            .collection(CollectionV2.DoubleRandomResults)
            .where(filter)
            .skip(Number(current - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .get()

        let { total } = await this.cloudbaseService
            .collection(CollectionV2.DoubleRandomResults)
            .where(filter)
            .count()

        data.map(d => {
            d.inspectionMatter = d.inspectionMatter.toString()
        })

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
    async updateDoubleRandomResultsById(
        @Body() body: DoubleRandomResult,
        @Request() req: AuthRequest) {
        const { _id, desc, status } = body

        let { requestId } = await this.cloudbaseService
            .collection(CollectionV2.DoubleRandomResults)
            .doc(_id)
            .update(
                {
                    status: status,
                    desc: desc
                }
            )

        return {
            requestId,
            success: true,
        }
    }
}