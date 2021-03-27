import { request } from 'umi';

export async function queryDoubleRandomResultByDRI(
    params: {
        // query
        /** 当前的页码 */
        current?: number;
        /** 页面的容量 */
        pageSize?: number
    },
    /** 双随机业务ID **/
    doubleRandomId: string
) {
    return request<Record<string, any>>(`/api/doubleRandomResult/${doubleRandomId}`, {
        method: 'GET',
        params
    });
}

export async function updateDoubleRandomResult(doubleRandomId: string, body: Partial<API.DualRandomResult>) {
    return request<Record<string, any>>(`/api/doubleRandomResult/${doubleRandomId}`, {
        method: 'PATCH',
        data: body,
    });
}

export async function exportDoubleRandomResultByDRIs(body: { doubleRandomIds: string[] }) {
    return request<Record<string, any>>('/api/doubleRandomResult/export', {
        method: 'POST',
        data: body
    });
}

export async function queryDoubleRandomResultByOpen(
    params: {
        // query
        /** 当前的页码 */
        current?: number;
        /** 页面的容量 */
        pageSize?: number;
    }) {
    return request<Record<string, any>>('/api/doubleRandomResult/open', {
        method: 'GET',
        params: {
            ...params,
        },
    });
}

export async function queryMarketParticipantWithDRR(
    params: { search: string }
) {
    return request<Record<string, any>>('/api/doubleRandomResult/marketParticipant', {
        method: 'GET',
        params: {
            ...params,
        },
    });

}
