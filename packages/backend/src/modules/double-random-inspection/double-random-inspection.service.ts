import { Injectable } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { Collection } from '@/constants';
import { CreateDoubleRandomInspectionDto } from './dto/create-double-random-inspection.dto';
import { UpdateDoubleRandomInspectionDto } from './dto/update-double-random-inspection.dto';

@Injectable()
export class DoubleRandomInspectionService {
  constructor(private readonly cloudbaseService: CloudBaseService) { }

  async create(
    createDoubleRandomInspectionDto: CreateDoubleRandomInspectionDto,
    marketParticipants: any[],
    lawEnforcementOfficials: any[],
  ) {
    // 开启双随机业务数据库事务
    const transaction = await this.cloudbaseService.db.startTransaction();
    // 插入双随机业务数据，并得到双随机业务ID
    const doubleRandomInspection = {
      ...createDoubleRandomInspectionDto,
      supervisionAdministrations: createDoubleRandomInspectionDto.supervisionAdministrations.map(sa => sa.name),
    }
    const { id } = await transaction
      .collection(Collection.DoubleRandomInspectionsV2)
      .add(doubleRandomInspection);
    // 组装双随机结果列表数据
    const {
      createdAt,
      inspectedAt,
      inspectionMatters,
    } = createDoubleRandomInspectionDto;
    const doubleRandomResultList = [];
    marketParticipants.forEach((marketParticipant, index) => {
      const { name, address, usci } = marketParticipant;
      const {
        supervisionAdministrations,
        groupCount,
      } = createDoubleRandomInspectionDto;
      const doubleRandomResult = {
        doubleRandomInspection: id,
        createdAt: createdAt,
        inspectedAt: inspectedAt,
        marketParticipant: name,
        marketParticipantUsci: usci,
        marketParticipantAddress: address,
        inspectionMatters: inspectionMatters,
        lawEnforcementOfficials: lawEnforcementOfficials[index % groupCount],
        supervisionAdministrations: supervisionAdministrations.map(sa => sa.name),
        // 标记状态为正常
        status: 2,
      };
      doubleRandomResultList.push(doubleRandomResult);
    });
    // 插入双随机结果列表
    await transaction
      .collection(Collection.DoubleRandomResultsV2)
      .add(doubleRandomResultList);
    // 提交事务
    await transaction.commit();

    return {
      doubleRandomInspectionId: id,
      statusCode: 201,
    };
  }

  async find(
    type: string,
    supervisionAdministrations: string[],
    current: number,
    pageSize: number,
  ) {
    let filter: any = {};
    const $ = this.cloudbaseService.db.command;
    filter.type = $.eq(type);
    if (!supervisionAdministrations?.some((_) => _ === '*')) {
      filter = {
        ...filter,
        'supervisionAdministrations': $.in(supervisionAdministrations),
      };
    }

    const { data } = await this.cloudbaseService
      .collection(Collection.DoubleRandomInspectionsV2)
      .where(filter)
      .orderBy('createdAt', 'desc')
      .skip(Number(current - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get();

    const { total } = await this.cloudbaseService
      .collection(Collection.DoubleRandomInspectionsV2)
      .where(filter)
      .count();

    return {
      data,
      total,
      pageSize,
      current: parseInt(`${current}`, 10) || 1,
      statusCode: 200,
    };
  }

  findAll() {
    return `This action returns all doubleRandomInspection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doubleRandomInspection`;
  }

  update(
    id: number,
    updateDoubleRandomInspectionDto: UpdateDoubleRandomInspectionDto,
  ) {
    return `This action updates a #${id} doubleRandomInspection`;
  }

  async removeOne(id: string) {
    const transaction = await this.cloudbaseService.db.startTransaction()

    await transaction
      .collection(Collection.DoubleRandomInspectionsV2)
      .doc(id)
      .remove();

    const { deleted } = await transaction
      .collection(Collection.DoubleRandomResultsV2)
      .where({ doubleRandomInspection: id })
      .remove();
    transaction.commit()

    return { deleted };
  }

  async migrate(current: number) {

    const transaction = await this.cloudbaseService.db.startTransaction()

    const MAX_LIMIT = 1000
    const { data } = await transaction
      .collection(Collection.DoubleRandomInspectionsV2)
      .skip(Number(current - 1) * Number(MAX_LIMIT))
      .limit(MAX_LIMIT)
      .get();

    const doubleRandomInspections: CreateDoubleRandomInspectionDto[] = new Array()
    data.map(async item => {
      const doubleRandomInspection: CreateDoubleRandomInspectionDto = {
        _id: item._id,
        createdAt: item.createdAt,
        dutyDepartments: [{ _id: "0", name: item.dutyDepartment }],
        groupCount: item.groupCount,
        industryTypes: [].concat(item.industryType).map((it, index) => { return { _id: `${index}`, name: it } }),
        inspectedAt: item.inspectedAt,
        inspectedRate: item.inspectedRate,
        inspectionAmount: item.inspectionAmount,
        personCount: item.personCount,
        inspectionMatters: [].concat(item.inspectionMatter).map((it, index) => { return { _id: `${index}`, name: it } }),
        supervisionAdministrations: [].concat(item.supervisionAdministration),
        type: 'normal'
      }
      doubleRandomInspections.push(doubleRandomInspection)
    })

    const { ids } = await transaction
      .collection(Collection.DoubleRandomInspectionsV2)
      .add(doubleRandomInspections);

    transaction.commit()

    return { ids }
  }
}
