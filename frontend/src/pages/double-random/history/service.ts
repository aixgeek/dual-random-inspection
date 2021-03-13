/*
 * @Author: June Lue
 * @Date: 2020-09-17 22:52:54
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 18:01:57
 * @FilePath: \VSCProjects\wanning-frontend\src\pages\double-random\history\service.ts
 */
import { tcbRequest } from '@/utils';
import { ListParams } from './data';

export async function queryList(params?: ListParams) {
  return tcbRequest('/doubleRandomInspection', {
    params,
  });
}

export async function queryResultList(params?: ListParams) {
  return tcbRequest('/doubleRandomResult', {
    params,
  });
}

export async function updateResult(params?: ListParams) {
  return tcbRequest('/doubleRandomResult', {
    method: 'POST',
    data: params,
  });
}

export async function exportList(params: { ids: string[] }) {
  return tcbRequest('/doubleRandomInspection/export', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
