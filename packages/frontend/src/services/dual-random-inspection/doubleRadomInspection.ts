import { request } from 'umi';

export async function submitDoubleRandomInspection(body: API.DoubleRandomInspection) {
    return request<Record<string, any>>('/api/doubleRandomInspection/normal', {
        method: 'POST',
        data: body,
    });
}

export async function submitCooperationDoubleRandomInspection(body: API.DoubleRandomInspection) {
    return request<Record<string, any>>('/api/doubleRandomInspection/cooperation', {
        method: 'POST',
        data: body,
    });
}

export async function queryDoubleRandomInspection(params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number
},
    /** 抽查类型 **/
    type: string
) {
    return request<Record<string, any>>(`/api/doubleRandomInspection/${type}`, {
        method: 'GET',
        params: {
            ...params,
        },
    });
}

export async function queryDoubleRandomResultByDRI(params: { doubleRandomId: string }) {
    return request<Record<string, any>>('/api/doubleRandomResult', {
        method: 'GET',
        params: {
            ...params,
        },
    });
}

