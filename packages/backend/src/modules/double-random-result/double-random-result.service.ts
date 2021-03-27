import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { Collection } from '@/constants';
import { CreateDoubleRandomResultDto } from './dto/create-double-random-result.dto';
import { UpdateDoubleRandomResultDto } from './dto/update-double-random-result.dto';

const StatusEnums = {
  0: '未检查',
  1: '责令整改',
  2: '正常',
  3: '异常',
};

@Injectable()
export class DoubleRandomResultService {
  constructor(private readonly cloudbaseService: CloudBaseService) { }

  create(createDoubleRandomResultDto: CreateDoubleRandomResultDto) {
    return 'This action adds a new doubleRandomResult';
  }

  async find(current: number, pageSize: number) {
    const { data } = await this.cloudbaseService
      .collection(Collection.DoubleRandomResultsV2)
      .orderBy('createdAt', 'desc')
      .skip(Number(current - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get();

    const { total } = await this.cloudbaseService
      .collection(Collection.DoubleRandomResultsV2)
      .count();

    return {
      data,
      total,
      statusCode: 200,
      pageSize,
      current: parseInt(`${current}`, 10) || 1,
    };
  }

  async findByDRI(doubleRandomId: string, current: number, pageSize: number) {
    let filter: any = {};
    const $ = this.cloudbaseService.db.command;
    filter = { ...filter, doubleRandomInspection: $.eq(doubleRandomId) };

    const { data } = await this.cloudbaseService
      .collection(Collection.DoubleRandomResultsV2)
      .where(filter)
      .orderBy('createdAt', 'desc')
      .skip(Number(current - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get();

    const { total } = await this.cloudbaseService
      .collection(Collection.DoubleRandomResultsV2)
      .where(filter)
      .count();

    return {
      data,
      total,
      statusCode: 200,
      pageSize,
      current: parseInt(`${current}`, 10) || 1,
    };
  }

  findAll() {
    return `This action returns all doubleRandomResult`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doubleRandomResult`;
  }

  async update(
    id: string,
    updateDoubleRandomResultDto: UpdateDoubleRandomResultDto,
  ) {
    await this.cloudbaseService
      .collection(Collection.DoubleRandomResultsV2)
      .doc(id)
      .update(updateDoubleRandomResultDto);

    return {
      statusCode: 201,
      data: id,
    };
  }

  async exportByDRI(doubleRandomIds: string[]) {
    const filter: any = {};
    const $ = this.cloudbaseService.db.command;
    filter.doubleRandomInspection = $.in(doubleRandomIds);

    const { data } = await this.cloudbaseService
      .collection(Collection.DoubleRandomResultsV2)
      .where(filter)
      .field({
        doubleRandomInspection: false,
        _id: false,
      })
      .get();

    // XLSX 格式转换
    data.map((d) => {
      d.inspectionMatters = d.inspectionMatters
        .map((item) => item.name)
        .join(',')
        .toString();
      d.lawEnforcementOfficials = d.lawEnforcementOfficials
        .map((item) => item.name)
        .join(',')
        .toString();
      d.supervisionAdministrations = d.supervisionAdministrations
        .map((item) => item.name)
        .join(',')
        .toString();
      d.inspectedAt = new Date(d.inspectedAt).toLocaleDateString();
      d.createdAt = new Date(d.createdAt).toLocaleDateString();
      d.status = StatusEnums[d.status];
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SheetJS');
    const tempId = new Date().getTime();
    await XLSX.writeFile(workbook, `/tmp/${tempId}.xlsx`, { bookType: 'xlsx' });
    const result = await this.cloudbaseService.app.uploadFile({
      cloudPath: `${tempId}.xlsx`,
      fileContent: fs.createReadStream(`/tmp/${tempId}.xlsx`),
    });

    return { data: result, statusCode: 200 };
  }

  remove(id: number) {
    return `This action removes a #${id} doubleRandomResult`;
  }

  async migrate(current: number) {

    const transaction = await this.cloudbaseService.db.startTransaction()

    const MAX_LIMIT = 1000
    const { data } = await transaction
      .collection(Collection.DoubleRandomResultsV2)
      .skip(Number(current - 1) * Number(MAX_LIMIT))
      .limit(MAX_LIMIT)
      .get();

    const doubleRandomResults: CreateDoubleRandomResultDto[] = new Array()
    data.map(async item => {
      const doubleRandomResult: CreateDoubleRandomResultDto = {
        createdAt: item.createdAt,
        doubleRandomInspection: item.doubleRandomInspection,
        inspectedAt: item.inspectedAt,
        inspectionMatters: [].concat(item.inspectionMatter).map((it, index) => { return { _id: `${index}`, name: it } }),
        lawEnforcementOfficials: item.lawEnforcementOfficial.split(',').map((it, index) => { return { _id: `${index}`, name: it } }),
        marketParticipant: item.marketParticipant,
        marketParticipantAddress: item.marketParticipantAddress,
        marketParticipantUsci: item.marketParticipantUsci,
        status: item.status,
        supervisionAdministrations: [].concat(item.supervisionAdministration),
      }
      doubleRandomResults.push(doubleRandomResult)
    })

    const { ids } = await transaction
      .collection(Collection.DoubleRandomResultsV2)
      .add(doubleRandomResults);

    transaction.commit()

    return { ids }
  }

}
