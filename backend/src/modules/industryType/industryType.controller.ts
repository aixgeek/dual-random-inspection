/*
 * @Author: June Lue
 * @Date: 2020-10-24 19:44:25
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 16:41:07
 * @FilePath: \VSCProjects\wanning-backend\src\modules\industryType\industryType.controller.ts
 */
import _ from 'lodash'
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator'
import { Controller, Get, Post, Request, Body, Query } from '@nestjs/common'
import { UnauthorizedOperation, RecordExistException } from '@/common'
import { CloudBaseService } from '@/services'
import { CollectionV2 } from '@/constants'

@Controller('industryType')
export class IndustryTypeController {
    constructor(
        private readonly cloudbaseService: CloudBaseService
    ) { }

    @Get()
    async getIndustryTypes(
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

        // 拿到所有监管单位下的行业类型，两层Map出IndustryType对象，然后Push到列表中
        const industryTypeData = []
        data?.map(d => {
            d.industryType.map(r => {
                r.supervisionAdministration = d.name
                industryTypeData.push(r)
            })
        })

        return {
            requestId,
            data: industryTypeData,
            success: true,
        }
    }

}