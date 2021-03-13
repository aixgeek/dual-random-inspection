/*
 * @Author: June Lue
 * @Date: 2020-10-24 19:46:18
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 00:27:26
 * @FilePath: \VSCProjects\wanning-frontend\src\pages\data-entry\service.ts
 */
import { tcbRequest } from '@/utils';
import { ListParams } from './data';

export async function queryIMList(params?: ListParams) {
  return tcbRequest('/inspectionMatter', {
    params,
  });
}

export async function queryMPList(params?: ListParams) {
  return tcbRequest('/marketParticipant', {
    params,
  });
}

export async function queryLEOList(params?: ListParams) {
  return tcbRequest('/lawEnforcementOfficial', {
    params,
  });
}
