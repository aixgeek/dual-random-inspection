import { request } from 'umi';

// IM

export async function addIM(body: API.InspectionMatter) {
    return request<Record<string, any>>('/api/inspectionMatter', {
        method: 'POST',
        data: body
    });
}

export async function updateIM(id: string, body: API.InspectionMatter) {
    return request<Record<string, any>>(`/api/inspectionMatter/${id}`, {
        method: 'PATCH',
        data: body
    });
}

export async function queryIMList(
    type: string,
    params: {
        // query
        /** 当前的页码 */
        current?: number;
        /** 页面的容量 */
        pageSize?: number;
    }) {
    return request<Record<string, any>>(`/api/inspectionMatter/${type}`, {
        method: 'GET',
        params: {
            ...params,
        }
    });
}

export async function queryAllIM(
    type: string,
    params: { supervisionAdministrations: string[] }
) {
    return request<Record<string, any>>(`/api/inspectionMatter/all/${type}`, {
        method: 'GET',
        params: {
            ...params,
        },
    });
}

export async function removeIMList(body: { ids: string[] }) {
    return request<Record<string, any>>('/api/inspectionMatter', {
        method: 'DELETE',
        data: body,
    });
}

// MP

export async function addMP(body: API.MarketParticipant) {
    return request<Record<string, any>>('/api/marketParticipant', {
        method: 'POST',
        data: body
    });
}

export async function updateMP(id: string, body: API.MarketParticipant) {
    return request<Record<string, any>>(`/api/marketParticipant/${id}`, {
        method: 'PATCH',
        data: body
    });
}

export async function queryMPList(
    type: string,
    params: Record<string, any> & {
        pageSize?: number;
        current?: number;
    }) {
    return request<Record<string, any>>(`/api/marketParticipant/${type}`, {
        method: 'GET',
        params: {
            ...params,
        },
    });
}

export async function removeMPList(body: { ids: string[] }) {
    return request<Record<string, any>>('/api/marketParticipant', {
        method: 'DELETE',
        data: body,
    });
}

// LEO

export async function addLEO(body: API.LawEnforcementOfficial) {
    return request<Record<string, any>>('/api/lawEnforcementOfficial', {
        method: 'POST',
        data: body
    });
}

export async function updateLEO(id: string, body: API.LawEnforcementOfficial) {
    return request<Record<string, any>>(`/api/lawEnforcementOfficial/${id}`, {
        method: 'PATCH',
        data: body
    });
}

export async function queryLEOList(
    params: {
        // query
        /** 当前的页码 */
        current?: number;
        /** 页面的容量 */
        pageSize?: number;
    }
) {
    return request<Record<string, any>>('/api/lawEnforcementOfficial', {
        method: 'GET',
        params: {
            ...params,
        },
    });
}

export async function removeLEOList(body: { ids: string[] }) {
    return request<Record<string, any>>('/api/lawEnforcementOfficial', {
        method: 'DELETE',
        data: body,
    });
}
