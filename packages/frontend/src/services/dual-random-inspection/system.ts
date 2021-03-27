import { request } from 'umi';

export async function queryAllSupervisionAdministration(type: string, params?: { supervisionAdministrations: string[] }) {
  return request<Record<string, any>>(`/api/supervisionAdministration/all/${type}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function queryAllDutyDepartment(type: string) {
  return request<Record<string, any>>(`/api/dutyDepartment/all/${type}`, {
    method: 'GET',
  });
}

export async function queryAllIndustryType(type: string, params?: { supervisionAdministrations: string[] }) {
  return request<Record<string, any>>(`/api/industryType/all/${type}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function queryIndustryType(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
}) {
  return request<Record<string, any>>('/api/industryType', {
    method: 'GET',
    params: {
      ...params
    }
  });
}
