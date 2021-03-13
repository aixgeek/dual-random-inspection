import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import _ from 'lodash'
import { IsNotEmpty } from 'class-validator'
import XLSX from 'xlsx';
import { Expose } from 'class-transformer';
import { Post, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { UnauthorizedOperation, RecordExistException } from '@/common'
import { CloudBaseService } from '@/services'
import { CollectionV2 } from '@/constants'
import { dateToNumber } from '@/utils'

class DoubleRandomInspection {
  _id: string;
  dutyDepartment: string;
  industryType: string;
  inspectedAt: string;
  inspectedRate: string;
  inspectionMatter: string;
  personCount: number;
  supervisionAdministration: string;
  inspectionAmount: number;
  createdAt: string;
}

class doubleRandomResult {
  _id: string;
  dutyDepartment: string;
  industryType: string;
  inspectedAt: string;
  inspectionMatter: string;
  personCount: number;
  supervisionAdministration: string;
  inspectionAmount: number;
  marketParticipant: string;
  lawEnforcementOfficial: string;
  status: string;
  desc: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly cloudbaseService: CloudBaseService
  ) { }

  @Get('import')
  async importHistoryData(req: Request, res: Response) {

    let { data } = await this.cloudbaseService
      .collection('temp_dr')
      .get()

    const dRIList = [];
    const dRIRList = [];

    for (let i = 0; i < data.length; i = i + 1) {
      let doubleRandomInspection = {
        createdAt: data[i].check_date,
        dutyDepartment: data[i].duty_department,
        groupCount: '',
        industryType: data[i].industry_classification,
        inspectedAt: data[i].deadline_date,
        inspectedRate: '',
        inspectionAmount: data[i].double_random_inspection_result.length,
        inspectionMatter: data[i].inspection_subject_matter,
        personCount: 2,
        supervisionAdministration: data[i].duty_department,
      }
      const { id } = await this.cloudbaseService
        .collection(CollectionV2.DoubleRandomInspections)
        .add(doubleRandomInspection);
      data[i].double_random_inspection_result.map(
        r => {
          let doubleRandomResult = {
            createdAt: data[i].check_date,
            doubleRandomInspection: id,
            inspectedAt: data[i].deadline_date,
            inspectionMatter: data[i].inspection_subject_matter,
            lawEnforcementOfficial: r.law_enforcement_official,
            marketParticipant: r.market_participant,
            marketParticipantAddress: '',
            marketParticipantUsci: '',
            supervisionAdministration: data[i].duty_department,
            status: 2,
            desc: ''
          }
          this.cloudbaseService
            .collection(CollectionV2.DoubleRandomResults)
            .add(doubleRandomResult);
        }
      )
    }
  }
  // let worksheet = XLSX.utils.json_to_sheet(dRIRList);
  // let workbook = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(workbook, worksheet, "SheetJS");
  // XLSX.writeFile(workbook, './filename.xlsx', { bookType: 'xlsx' })
}
