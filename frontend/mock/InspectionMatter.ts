import { Request, Response } from 'express';
import { parse } from 'url';
import { ListParams } from '@/pages/data-entry/data';
import mockjs from 'mockjs';

let mockListDataSource: [] = mockjs.mock(
    {
        'data|100': [{
            key: '@guid',
            name: '@cword(3, 8)',
            content: '@cparagraph',
            legalBasis: '@cparagraph',
            supervisionAdministration: '@cword(3, 8)',
            object: '@cword(3, 8)',
            method: '@cword(3, 8)',
            proportion: '@cword(3, 8)',
            frequency: '@cword(3, 8)',
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

const submitDoubleRandom = (req: Request, res: Response) => {
    res.json({
        data: '1212121',
    });
};

const queryDoubleRandomResult = (req: Request, res: Response) => {
    res.json({
        data: [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        },
        {
            key: '4',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        }]
    });
}

export default {
    'GET /api/inspectionMatter': getList,
    'POST /api/inspectionMatter': getList,
    'POST /api/doubleRandom': submitDoubleRandom,
    'POST /api/doubleRandomResult': queryDoubleRandomResult,
};