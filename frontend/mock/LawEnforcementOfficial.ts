// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { parse } from 'url';
import { ListParams } from '@/pages/data-entry/data';
import mockjs from 'mockjs';

let mockListDataSource: [] = mockjs.mock(
    {
        'data|100': [{
            key: '@guid',
            idNumber: '@id',
            name: '@cword(5, 10)',
            sex: '',
            certificateInfo: '@cword(3, 8)',
            certificateId: '@id',
            supervisionAdministration: '@cword(3, 8)',
            dutyDepartment: '@cword(3, 8)',
            budgetedPost: '@cword(3, 8)',
            desc: '@cparagraph'
        }]
    }).data;

function getList(req: Request, res: Response, u: string) {
    let realUrl = u;
    if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
        realUrl = req.url;
    }
    const { current = 1, pageSize = 10 } = req.query;
    const params = (parse(realUrl, true).query as unknown) as ListParams;

    let dataSource = mockListDataSource;
    const dataSourceResult = [...dataSource].slice(
        ((current as number) - 1) * (pageSize as number),
        (current as number) * (pageSize as number),
    );
    const result = {
        data: dataSourceResult,
        total: dataSource.length,
        success: true,
        pageSize,
        current: parseInt(`${params.currentPage}`, 10) || 1,
    };

    res.json(result);
}

export default {
    'GET /api/lawEnforcementOfficial': getList,
    'POST /api/lawEnforcementOfficial': getList,
};