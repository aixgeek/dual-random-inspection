/*
 * @Author: June Lue
 * @Date: 2020-10-24 19:44:25
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 18:24:52
 * @FilePath: \VSCProjects\wanning-backend\src\modules\doubleRandomInspection\doubleRandomInspection.controller.ts
 */
import _ from 'lodash'
import { IsNotEmpty } from 'class-validator'
import { Controller, Get, Post, Request, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import XLSX from 'xlsx';
import { RecordNotExistException } from '@/common'
import { CloudBaseService } from '@/services'
import { CollectionV2 } from '@/constants'
import fs from 'fs';

class DoubleRandomInspection {
    _id: string
    @IsNotEmpty()
    dutyDepartment: string
    @IsNotEmpty()
    industryType: string[]
    @IsNotEmpty()
    inspectedAt: string
    @IsNotEmpty()
    inspectedRate: number
    @IsNotEmpty()
    inspectionMatter: string[]
    @IsNotEmpty()
    personCount: number
    @IsNotEmpty()
    groupCount: number
    @IsNotEmpty()
    supervisionAdministration: string
    @IsNotEmpty()
    createdAt: string
    inspectionAmount: number
}

@Controller('doubleRandomInspection')
export class DoubleRandomInspectionController {
    constructor(
        private readonly cloudbaseService: CloudBaseService
    ) { }

    @Post()
    async postDoubleRandomInspection(@Body() body: DoubleRandomInspection,
        @Request() req: AuthRequest) {

        // 基础限制：登录用户只能访问所管辖的监管单位的业务数据
        const currentUser = req.authUser
        const allSupervisionAdministrations = currentUser.supervisionAdministrations

        // 限制条件：监管单位+市场主体行业类型+市场主体分管部门
        const { industryType, dutyDepartment, supervisionAdministration } = body
        const supervisionAdministrations = []
        const dutyDepartments = []
        if (allSupervisionAdministrations?.some((_) => _ === supervisionAdministration)) {
            supervisionAdministrations.push(supervisionAdministration)
            dutyDepartments.push(dutyDepartment)
        }
        const $ = this.cloudbaseService.db.command
        const filter: any = {}
        filter.supervisionAdministration = $.in(supervisionAdministrations)
        filter.industryType = $.in(industryType)
        filter.dutyDepartment = $.in(dutyDepartments)

        // 根据限制条件和抽选率,计算出抽选数量取整，随机抽选出市场主体，如果数量计算小于或等于0，则抛出市场主体记录不存在异常
        const { inspectedRate } = body
        let { total } = await this.cloudbaseService
            .collection(CollectionV2.MarketParticipants)
            .where(filter)
            .count()
        if (total <= 0) {
            throw new RecordNotExistException()
        } else if (total * (inspectedRate / 100) < 1) {
            total = 1
        } else {
            total = ~~(total * (inspectedRate / 100))
        }

        const { data: marketParticipants } = await this.cloudbaseService.db
            .collection(CollectionV2.MarketParticipants)
            .aggregate()
            .match(
                {
                    supervisionAdministration: filter.supervisionAdministration,
                    industryType: filter.industryType
                }
            )
            .sample({
                size: total
            })
            .limit(total)
            .end()

        // 根据要求组数和每组人数,随机抽选出执法人员并分组，如果抽选结果不满足要求，则抛出执法人员记录不存在异常
        const { personCount, groupCount } = body
        const lawEnforcementOfficialsList = new Array(groupCount)
        for (let i = 0; i < groupCount; i = i + 1) {
            const { data: lawEnforcementOfficials } = await this.cloudbaseService.db
                .collection(CollectionV2.LawEnforcementOfficials)
                .aggregate()
                .match(
                    {
                        dutyDepartment: filter.dutyDepartment,
                        supervisionAdministration: filter.supervisionAdministration
                    }
                )
                .sample({
                    size: personCount
                })
                .limit(personCount)
                .end()
            if (lawEnforcementOfficials.length < personCount) {
                throw new RecordNotExistException()
            }
            let LEOs = ""
            lawEnforcementOfficials.forEach((element, index) => {
                if (index === 0) {
                    LEOs = LEOs + element.name
                } else {
                    LEOs = LEOs + "," + element.name
                }
            })
            lawEnforcementOfficialsList[i] = LEOs
        }

        // 开启双随机业务数据库事务
        const transaction = await this.cloudbaseService.db.startTransaction();
        // 组装双随机业务数据
        const doubleRandomInspectionDTO = {
            ...body,
            inspectionAmount: total
        }
        // 插入双随机业务数据，并得到双随机业务ID
        const { id } = await transaction.collection(CollectionV2.DoubleRandomInspections)
            .add(doubleRandomInspectionDTO)
        // 组装双随机结果列表数据
        const { createdAt, inspectedAt, inspectionMatter } = body
        const doubleRandomResultList = new Array(total)
        marketParticipants.forEach((marketParticipant, index) => {
            const { name, address, usci } = marketParticipant
            const doubleRandomResult = {
                doubleRandomInspection: id,
                createdAt: createdAt,
                inspectedAt: inspectedAt,
                inspectionMatter: inspectionMatter,
                marketParticipant: name,
                marketParticipantUsci: usci,
                marketParticipantAddress: address,
                lawEnforcementOfficial: lawEnforcementOfficialsList[index % groupCount],
                supervisionAdministration: supervisionAdministration,
                // 标记状态为正常
                status: 2
            }
            doubleRandomResultList[index] = doubleRandomResult
        })
        // 插入双随机结果列表
        await transaction.collection(CollectionV2.DoubleRandomResults)
            .add(doubleRandomResultList)
        // 提交事务
        await transaction.commit();

        return {
            doubleRandomInspectionId: id,
            success: true
        }
    }

    @Get()
    async getDoubleRandomInspections(@Query() query: { current?: number; pageSize?: number } = {},
        @Request() req: AuthRequest) {
        const { current = 1, pageSize = 20 } = query

        // 可获取的所有监管单位列表
        const allSupervisionAdministrations = req.authUser.supervisionAdministrations
        const filter: any = {}
        if (!allSupervisionAdministrations?.some((_) => _ === '*')) {
            const $ = this.cloudbaseService.db.command
            filter.supervisionAdministration = $.in(allSupervisionAdministrations)
        }

        const { data, requestId } = await this.cloudbaseService
            .collection(CollectionV2.DoubleRandomInspections)
            .where(filter)
            .orderBy('createdAt', 'desc')
            .skip(Number(current - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .get()

        // 数组转字符串
        data.map(d => {
            d.inspectionMatter = d.inspectionMatter.toString()
            d.industryType = d.industryType.toString()
        })

        const { total } = await this.cloudbaseService
            .collection(CollectionV2.DoubleRandomInspections)
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

    @Post('export')
    async exportDoubleRandomInspections(@Body() body: { ids: string[] },
        @Request() req: AuthRequest) {
        const { ids } = body
        const limit = 1000

        // 可获取的所有监管单位列表
        const allSupervisionAdministrations = req.authUser.supervisionAdministrations
        const filter: any = {}
        const $ = this.cloudbaseService.db.command
        if (!allSupervisionAdministrations?.some((_) => _ === '*')) {
            filter.supervisionAdministration = $.in(allSupervisionAdministrations)
        }
        if (ids) {
            filter.doubleRandomInspection = $.in(ids)
        }

        const { data, requestId } = await this.cloudbaseService
            .collection(CollectionV2.DoubleRandomResults)
            .where(filter)
            .field({
                doubleRandomInspection: false,
                _id: false
            })
            .limit(limit)
            .get()

        // 数组转字符串
        data.map(d => {
            d.inspectionMatter = d.inspectionMatter.toString();
            d.inspectedAt = new Date(d.inspectedAt).toLocaleDateString();
            d.createdAt = new Date(d.createdAt).toLocaleDateString();
            if (d.status == '0') { d.status = '未检查' }
            else if (d.status == '1') { d.status = '责令整改' }
            else if (d.status == '3') { d.status = '异常' }
            else { d.status = '正常' }
        })

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "SheetJS");
        const tempId = new Date().getTime()
        await XLSX.writeFile(workbook, `/tmp/${tempId}.xlsx`, { bookType: 'xlsx' })
        const result = await this.cloudbaseService.app.uploadFile({
            cloudPath: `${tempId}.xlsx`,
            fileContent: fs.createReadStream(`/tmp/${tempId}.xlsx`)
        })

        return {
            requestId,
            data: result,
            success: true,
        }
    }
}