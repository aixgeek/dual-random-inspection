/*
 * @Author: June Lue
 * @Date: 2020-09-17 22:52:54
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 18:01:57
 * @FilePath: \VSCProjects\wanning-frontend\src\pages\double-random\history\service.ts
 */
import { tcbRequest } from '@/utils';
import { ListParams } from './data';

export async function queryResultListInOpen(params?: ListParams) {
  return tcbRequest('/doubleRandomResult/open', {
    params,
  });
}
