import { Injectable } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { Collection } from '@/constants';
import { CreateInspectionMatterDto } from './dto/create-inspection-matter.dto';
import { UpdateInspectionMatterDto } from './dto/update-inspection-matter.dto';

@Injectable()
export class InspectionMatterService {
  constructor(private readonly cloudbaseService: CloudBaseService) { }

  create(createInspectionMatterDto: CreateInspectionMatterDto) {
    return 'This action adds a new inspectionMatter';
  }

  async find(
    supervisionAdministrations: string[],
    current: number,
    pageSize: number,
  ) {
    const filter: any = {};
    if (!supervisionAdministrations?.some((_) => _ === '*')) {
      const $ = this.cloudbaseService.db.command;
      filter.supervisionAdministrations = $.in(supervisionAdministrations);
    }

    const { data } = await this.cloudbaseService
      .collection(Collection.InspectionMattersV2)
      .where(filter)
      .skip(Number(current - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get();

    const { total } = await this.cloudbaseService
      .collection(Collection.InspectionMattersV2)
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
      filter.supervisionAdministrations = $.in(supervisionAdministrations);
    }

    const { data } = await this.cloudbaseService
      .collection(Collection.InspectionMattersV2)
      .where(filter)
      .get();

    const { total } = await this.cloudbaseService
      .collection(Collection.InspectionMattersV2)
      .where(filter)
      .count();

    return {
      data,
      total,
      statusCode: 200,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} inspectionMatter`;
  }

  update(id: number, updateInspectionMatterDto: UpdateInspectionMatterDto) {
    return `This action updates a #${id} inspectionMatter`;
  }

  remove(id: number) {
    return `This action removes a #${id} inspectionMatter`;
  }

  async migrate(current: number) {

    const transaction = await this.cloudbaseService.db.startTransaction()

    const MAX_LIMIT = 1000
    const { data } = await transaction
      .collection(Collection.InspectionMattersV2)
      .skip(Number(current - 1) * Number(MAX_LIMIT))
      .limit(MAX_LIMIT)
      .get();

    const inspectionMatters: CreateInspectionMatterDto[] = new Array()
    data.map(async item => {
      const inspectionMatter: CreateInspectionMatterDto = {
        name: item.name,
        content: item.content,
        desc: item.desc,
        frequency: item.frequency,
        legalBasis: item.legalBasis,
        method: item.method,
        object: item.object,
        proportion: item.proportion,
        type: 'normal',
        industryTypes: [],
        supervisionAdministrations: [].concat(item.supervisionAdministration),
        _updateTime: new Date().toLocaleDateString(),
        _createTime: new Date().toLocaleDateString(),
      }
      inspectionMatters.push(inspectionMatter)
    })

    const { ids } = await transaction
      .collection(Collection.InspectionMattersV2)
      .add(inspectionMatters);

    transaction.commit()

    return { ids }
  }

}
