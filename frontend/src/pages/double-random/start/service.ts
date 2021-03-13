/*
 * @Author: June Lue
 * @Date: 2020-10-24 19:45:33
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 17:52:55
 * @FilePath: \VSCProjects\wanning-frontend\src\pages\double-random\start\service.ts
 */
import { tcbRequest } from '@/utils';

export interface DoubleRandomParamsType {
  personCount: number;
  inspectionMatter: string;
}

export interface ResultListParams {
  id?: string;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}

export async function fetchInspectedMatters() {
  return tcbRequest('/inspectionMatter');
}

export async function fetchSupervisionAdministrations() {
  return tcbRequest('/supervisionAdministration');
}

export async function fetchDutyDepartments() {
  return tcbRequest('/dutyDepartment');
}

export async function fetchIndustryTypes() {
  return tcbRequest('/industryType');
}

export async function submitDoubleRandom(params: DoubleRandomParamsType) {
  return tcbRequest('/doubleRandomInspection', {
    method: 'POST',
    data: params,
  });
}

export async function queryDoubleRandomResult(params?: ResultListParams) {
  return tcbRequest('/doubleRandomResult', {
    params,
  });
}
