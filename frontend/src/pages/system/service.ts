/*
 * @Author: June Lue
 * @Date: 2020-09-21 15:59:03
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 16:06:32
 * @FilePath: \VSCProjects\wanning-frontend\src\pages\system\service.ts
 */
import { request } from 'umi';

export async function querySupervisionAdministration(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/supervisionAdministration', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryIndustryType(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/industryType', {
    method: 'GET',
    ...(options || {}),
  });
}
