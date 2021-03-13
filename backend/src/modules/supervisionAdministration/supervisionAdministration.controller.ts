/*
 * @Author: June Lue
 * @Date: 2020-10-24 19:44:25
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 15:40:29
 * @FilePath: \VSCProjects\wanning-backend\src\modules\supervisionAdministration\supervisionAdministration.controller.ts
 */
import _ from 'lodash'
import { Controller, Get, Post, Request, Body, Query } from '@nestjs/common'
import { CloudBaseService } from '@/services'
import { CollectionV2 } from '@/constants'

class SupervisionAdministration {
    _id: string
    name: string
    contactPerson: string
    contactPhone: string
    username: string
    password: string
    industryType: IndustryType[]
    dutyDepartment: DutyDepartment[]
    desc: string
}

class IndustryType {
    key: number
    name: string
    count: number
    dutyDepartment: string
    desc: string
}

class DutyDepartment {
    key: number
    name: string
    contactPerson: string
    contactPhone: string
    desc: string
}

@Controller('supervisionAdministration')
export class SupervisionAdministrationController {
    constructor(
        private readonly cloudbaseService: CloudBaseService
    ) { }

    @Get()
    async getSupervisionAdministrations(
        @Request() req: AuthRequest) {

        // 可获取的所有监管单位列表
        const allSupervisionAdministrations = req.authUser.supervisionAdministrations
        const filter: any = {}
        if (!allSupervisionAdministrations?.some((_) => _ === '*')) {
            const $ = this.cloudbaseService.db.command
            filter.name = $.in(allSupervisionAdministrations)
        }

        let { data, requestId } = await this.cloudbaseService
            .collection(CollectionV2.SupervisionAdministrations)
            .where(filter)
            .get()

        return {
            requestId,
            data,
            success: true,
        }
    }

    @Post()
    async createSupervisionAdministration(
        @Body() body: SupervisionAdministration,
        @Request() req: AuthRequest) {

        const supervisionAdministration = {
            ...body
        }

        let { id, requestId } = await this.cloudbaseService
            .collection(CollectionV2.SupervisionAdministrations)
            .add(supervisionAdministration)

        return {
            requestId,
            id,
            success: true,
        }
    }
}