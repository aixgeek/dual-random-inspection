/*
 * @Author: June Lue
 * @Date: 2020-09-17 22:52:54
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 18:01:57
 * @FilePath: \VSCProjects\wanning-frontend\src\pages\double-random\history\service.ts
 */
import { request } from 'umi';

export async function queryDoubleRandomResultByOpen(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/doubleRandomResult/open', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

