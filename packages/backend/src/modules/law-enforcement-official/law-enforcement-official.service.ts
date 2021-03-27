import { Injectable } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { Collection } from '@/constants';
import { CreateLawEnforcementOfficialDto } from './dto/create-law-enforcement-official.dto';
import { UpdateLawEnforcementOfficialDto } from './dto/update-law-enforcement-official.dto';

@Injectable()
export class LawEnforcementOfficialService {
  constructor(private readonly cloudbaseService: CloudBaseService) { }

  create(createLawEnforcementOfficialDto: CreateLawEnforcementOfficialDto) {
    return 'This action adds a new lawEnforcementOfficial';
  }

  async findRandom(
    supervisionAdministration: string,
    dutyDepartments: string[],
    personCount: number,
    groupCount: number,
  ) {
    // 根据要求组数和每组人数,随机抽选出执法人员并分组，如果抽选结果不满足要求，则抛出执法人员记录不存在异常
    const $ = this.cloudbaseService.db.command;

    const total = (personCount * groupCount) as number;
    const filter: any = {};
    filter.supervisionAdministration = $.eq(supervisionAdministration);
    filter.dutyDepartments = $.in(dutyDepartments);

    const { data } = await this.cloudbaseService.db
      .collection(Collection.LawEnforcementOfficialsV2)
      .aggregate()
      .match(filter)
      .sample({
        size: total,
      })
      .limit(total)
      .end();
    const lawEnforcementOfficials = data;

    const groups: any[] = [];
    for (let i = 0; i < groupCount; i++) {
      const persons: any[] = [];
      for (let j = 0; j < personCount; j++) {
        const leo = lawEnforcementOfficials.shift();
        persons.push(leo);
        lawEnforcementOfficials.push(leo);
      }
      groups.push(persons);
    }

    return groups;
  }

  async findRandomByCooperation(
    supervisionAdministrations: string[],
    personCount: number,
    groupCount: number,
  ) {
    // 根据要求组数和每组人数,随机抽选出执法人员并分组，如果抽选结果不满足要求，则抛出执法人员记录不存在异常
    const $ = this.cloudbaseService.db.command;

    const total = (personCount * groupCount) as number;
    const average = Math.round(total / supervisionAdministrations.length);

    const LEOMap = new Map();
    for (let i = 0; i < supervisionAdministrations.length; i++) {
      const filter: any = {};
      filter.supervisionAdministration = supervisionAdministrations[i];
      const { data } = await this.cloudbaseService.db
        .collection(Collection.LawEnforcementOfficialsV2)
        .aggregate()
        .match(filter)
        .sample({
          size: average,
        })
        .limit(average)
        .end();
      LEOMap.set(supervisionAdministrations[i], data);
    }
    const result: any[] = [];
    for (let i = 0; i < groupCount; i++) {
      const LEOs: any[] = [];
      for (let j = 0; j < personCount; j++) {
        const s = j % supervisionAdministrations.length;
        const leo = LEOMap.get(supervisionAdministrations[s]).shift();
        LEOs.push(leo);
        LEOMap.get(supervisionAdministrations[s]).push(leo);
      }
      result.push(LEOs);
    }

    return result;
  }

  async find(
    supervisionAdministrations: string[],
    current: number,
    pageSize: number,
  ) {
    const filter: any = {};
    if (!supervisionAdministrations?.some((_) => _ === '*')) {
      const $ = this.cloudbaseService.db.command;
      filter.supervisionAdministration = $.in(supervisionAdministrations);
    }

    const { data } = await this.cloudbaseService
      .collection(Collection.LawEnforcementOfficialsV2)
      .where(filter)
      .skip(Number(current - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get();

    const { total } = await this.cloudbaseService
      .collection(Collection.LawEnforcementOfficialsV2)
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

  async findAll(supervisionAdministrations?: string[]) {
    const filter: any = {};
    if (!supervisionAdministrations?.some((_) => _ === '*')) {
      const $ = this.cloudbaseService.db.command;
      filter.supervisionAdministration = $.in(supervisionAdministrations);
    }

    const { data } = await this.cloudbaseService
      .collection(Collection.LawEnforcementOfficialsV2)
      .where(filter)
      .get();

    const { total } = await this.cloudbaseService
      .collection(Collection.LawEnforcementOfficialsV2)
      .where(filter)
      .count();

    return {
      data,
      total,
      statusCode: 200,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} lawEnforcementOfficial`;
  }

  update(
    id: number,
    updateLawEnforcementOfficialDto: UpdateLawEnforcementOfficialDto,
  ) {
    return `This action updates a #${id} lawEnforcementOfficial`;
  }

  remove(id: number) {
    return `This action removes a #${id} lawEnforcementOfficial`;
  }

  async migrate(current: number) {

    const transaction = await this.cloudbaseService.db.startTransaction()

    const MAX_LIMIT = 1000
    const { data } = await transaction
      .collection(Collection.LawEnforcementOfficialsV2)
      .skip(Number(current - 1) * Number(MAX_LIMIT))
      .limit(MAX_LIMIT)
      .get();

    const lawEnforcementOfficials: CreateLawEnforcementOfficialDto[] = new Array()
    data.map(async item => {
      const lawEnforcementOfficial: CreateLawEnforcementOfficialDto = {
        name: item.name,
        budgetedPost: item.budgetedPost,
        certificateId: item.certificateId,
        certificateInfo: item.certificateInfo,
        idNumber: item.idNumber,
        sex: item.sex,
        flag: 1,
        dutyDepartments: [].concat(item.dutyDepartment),
        supervisionAdministration: item.supervisionAdministration,
        _updateTime: new Date().toLocaleDateString(),
        _createTime: new Date().toLocaleDateString(),
      }
      lawEnforcementOfficials.push(lawEnforcementOfficial)
    })

    const { ids } = await transaction
      .collection(Collection.LawEnforcementOfficialsV2)
      .add(lawEnforcementOfficials);

    transaction.commit()

    return { ids }
  }
}
