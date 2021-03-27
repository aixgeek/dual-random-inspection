import { Injectable } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { Collection } from '@/constants';
import { CreateSupervisionAdministrationDto } from './dto/create-supervision-administration.dto';
import { UpdateSupervisionAdministrationDto } from './dto/update-supervision-administration.dto';

@Injectable()
export class SupervisionAdministrationService {
  constructor(private readonly cloudbaseService: CloudBaseService) {}

  create(
    createSupervisionAdministrationDto: CreateSupervisionAdministrationDto,
  ) {
    return 'This action adds a new supervisionAdministration';
  }

  async find(
    supervisionAdministrations: string[],
    current: number,
    pageSize: number,
  ) {
    const filter: any = {};
    if (!supervisionAdministrations?.some((_) => _ === '*')) {
      const $ = this.cloudbaseService.db.command;
      filter.name = $.in(supervisionAdministrations);
    }

    const { data } = await this.cloudbaseService
      .collection(Collection.SupervisionAdministrationsV2)
      .where(filter)
      .skip(Number(current - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get();

    const { total } = await this.cloudbaseService
      .collection(Collection.SupervisionAdministrationsV2)
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
      filter.name = $.in(supervisionAdministrations);
    }

    const { data } = await this.cloudbaseService
      .collection(Collection.SupervisionAdministrationsV2)
      .where(filter)
      .get();

    const { total } = await this.cloudbaseService
      .collection(Collection.SupervisionAdministrationsV2)
      .where(filter)
      .count();

    return {
      data,
      total,
      statusCode: 200,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} supervisionAdministration`;
  }

  update(
    id: number,
    updateSupervisionAdministrationDto: UpdateSupervisionAdministrationDto,
  ) {
    return `This action updates a #${id} supervisionAdministration`;
  }

  remove(id: number) {
    return `This action removes a #${id} supervisionAdministration`;
  }
}
