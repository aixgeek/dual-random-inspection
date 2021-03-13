/*
 * @Author: June Lue
 * @Date: 2020-09-21 15:59:03
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 16:06:32
 * @FilePath: \VSCProjects\wanning-frontend\src\pages\system\service.ts
 */
import { tcbRequest } from '@/utils';

export async function querySupervisionAdministration() {
  return tcbRequest('/supervisionAdministration');
}

export async function queryIndustryType() {
  return tcbRequest('/industryType');
}
