import { Injectable } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { Collection } from '@/constants';
import { CreateDutyDepartmentDto } from './dto/create-duty-department.dto';
import { UpdateDutyDepartmentDto } from './dto/update-duty-department.dto';

@Injectable()
export class DutyDepartmentService {
  constructor(private readonly cloudbaseService: CloudBaseService) {}

  create(createDutyDepartmentDto: CreateDutyDepartmentDto) {
    return 'This action adds a new dutyDepartment';
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
      .collection(Collection.DutyDepartmentsV2)
      .where(filter)
      .skip(Number(current - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get();

    const { total } = await this.cloudbaseService
      .collection(Collection.DutyDepartmentsV2)
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

  async findAll(supervisionAdministrations: string[]) {
    const filter: any = {};
    if (!supervisionAdministrations?.some((_) => _ === '*')) {
      const $ = this.cloudbaseService.db.command;
      filter.supervisionAdministration = $.in(supervisionAdministrations);
    }

    const { data } = await this.cloudbaseService
      .collection(Collection.DutyDepartmentsV2)
      .where(filter)
      .get();

    const { total } = await this.cloudbaseService
      .collection(Collection.DutyDepartmentsV2)
      .where(filter)
      .count();

    return {
      data,
      total,
      statusCode: 200,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} dutyDepartment`;
  }

  update(id: number, updateDutyDepartmentDto: UpdateDutyDepartmentDto) {
    return `This action updates a #${id} dutyDepartment`;
  }

  remove(id: number) {
    return `This action removes a #${id} dutyDepartment`;
  }
}
