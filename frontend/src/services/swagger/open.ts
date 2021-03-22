// @ts-ignore
/* eslint-disable */
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

export async function findMarketParticipantWithDRR(
  params: {
    info: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.MarketParticipant>(`/api/marketParticipant/find`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

