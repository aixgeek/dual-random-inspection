/*
 * @Author: June Lue
 * @Date: 2020-10-24 19:46:18
 * @LastEditors: June Lue
 * @LastEditTime: 2020-10-25 00:27:26
 * @FilePath: \VSCProjects\wanning-frontend\src\pages\data-entry\service.ts
 */
import { request } from 'umi';

export async function queryIMList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/inspectionMatter', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function queryMPList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/marketParticipant', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function queryLEOList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/lawEnforcementOfficial', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
