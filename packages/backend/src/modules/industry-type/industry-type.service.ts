import { Injectable } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { Collection } from '@/constants';
import { CreateIndustryTypeDto } from './dto/create-industry-type.dto';
import { UpdateIndustryTypeDto } from './dto/update-industry-type.dto';

@Injectable()
export class IndustryTypeService {
  constructor(private readonly cloudbaseService: CloudBaseService) { }

  create(createIndustryTypeDto: CreateIndustryTypeDto) {
    return 'This action adds a new industryType';
  }

  async findAll(supervisionAdministrations: string[]) {
    let filter = {};
    const $ = this.cloudbaseService.db.command;
    if (!supervisionAdministrations?.some((_) => _ === '*')) {
      filter = { ...filter, supervisionAdministrations: $.in(supervisionAdministrations) }
    }

    const { data } = await this.cloudbaseService
      .collection(Collection.IndustryTypesV2)
      .where(filter)
      .get();

    return {
      data,
      statusCode: 200,
    };
  }

  async find(
    supervisionAdministrations: string[],
    current: number,
    pageSize: number,
  ) {
    const filter: any = {};
    const $ = this.cloudbaseService.db.command;
    if (!supervisionAdministrations?.some((_) => _ === '*')) {
      filter.supervisionAdministrations = $.in(supervisionAdministrations);
    }

    const { data } = await this.cloudbaseService
      .collection(Collection.IndustryTypesV2)
      .where(filter)
      .orderBy('_id', 'desc')
      .skip(Number(current - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get();

    const { total } = await this.cloudbaseService
      .collection(Collection.IndustryTypesV2)
      .where(filter)
      .count();

    return { data, total };
  }

  findOne(id: number) {
    return `This action returns a #${id} industryType`;
  }

  update(id: number, updateIndustryTypeDto: UpdateIndustryTypeDto) {
    return `This action updates a #${id} industryType`;
  }

  remove(id: number) {
    return `This action removes a #${id} industryType`;
  }

  async migrate() {

    const transaction = await this.cloudbaseService.db.startTransaction()

    const { data } = await transaction
      .collection(Collection.IndustryTypesV2)
      .get();

    const industryTypeMap = new Map()
    data.map(item => {
      const industryType: CreateIndustryTypeDto = {
        name: item.name,
        desc: item.desc,
        supervisionAdministrations: industryTypeMap.has(item.name) ?
          industryTypeMap.get(item.name).supervisionAdministrations.concat(item.supervisionAdministration) :
          [].concat(item.supervisionAdministration)
      }
      industryTypeMap.set(industryType.name, industryType)
    })

    const industryTypes: CreateIndustryTypeDto[] = Array.from(industryTypeMap.values())
    const { ids } = await transaction
      .collection(Collection.IndustryTypesV2)
      .add(industryTypes);

    transaction.commit()

    return { ids }
  }
}
