// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { parse } from 'url';
import { ListItem, ListParams, ResultListItem, ResultListParams } from '@/pages/double-random/history/data';
import XLSX from 'xlsx';
import mockjs from 'mockjs';
import { delay } from 'roadhog-api-doc';

// mock tableListDataSource
let mockListDataSource: ListItem[] = mockjs.mock(
    {
        'data|100': [{
            'key': '@guid',
            'inspection_subject_matter|1-10': '★',
            'inspection_amount|1-100': 100,
            'industry_type': '@cword(3, 8)',
            'supervision_adminitration': '@cword(5, 10)',
            'duty_department': '@cword(5, 10)',
            'inspection_date': '@date',
            'inspectedAt': '@date',
            'desc': '@cparagraph',
            'result|1-100': [{
                'result_key': '@guid',
                'market_participant': '@cword(5, 10)',
                'status|0-3': 3,
                'law_enforcement_officials': '@cname , @cname',
                'desc': '@cparagraph'
            }]
        }]
    }).data

function getList(req: Request, res: Response, u: string) {
    let realUrl = u;
    if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
        realUrl = req.url;
    }
    const { current = 1, pageSize = 10 } = req.query;
    const params = (parse(realUrl, true).query as unknown) as ListParams;

    let dataSource = mockListDataSource;
    if (params.inspection_subject_matter) {
        dataSource = dataSource.filter((data) => data.inspection_subject_matter.includes(params.inspection_subject_matter || ''));
    }
    if (params.inspection_date) {
        dataSource = dataSource.filter((data) => data.inspection_date === params.inspection_date);
    }
    if (params.check_date) {
        dataSource = dataSource.filter((data) => data.check_date === params.check_date);
    }
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

function postList(req: Request, res: Response, u: string, b: Request) {
    let realUrl = u;
    if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
        realUrl = req.url;
    }
    const body = (b && b.body) || req.body;
    const { method, name, desc, key } = body;

    switch (method) {
        /* eslint no-case-declarations:0 */
        case 'delete':
            mockListDataSource = mockListDataSource.filter((item) => key.indexOf(item.key) === -1);
            break;
        default:
            break;
    }

    const result = {
        list: mockListDataSource,
        pagination: {
            total: mockListDataSource.length,
        },
    };

    res.json(result);

}

function exportList(req: Request, res: Response, u: string, b: Request) {
    let realUrl = u;
    if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
        realUrl = req.url;
    }
    const body = (b && b.body) || req.body;
    const { method, name, desc, key } = body;

    let dataSource = mockListDataSource.filter((item) => key.indexOf(item.key) !== -1);
    let worksheet = XLSX.utils.json_to_sheet(dataSource);
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SheetJS");
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

    res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=Download.xlsx',
    });
    res.end(buffer);
}

function getResultList(req: Request, res: Response, u: string) {
    let realUrl = u;
    if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
        realUrl = req.url;
    }
    const { id, current = 1, pageSize = 10 } = req.query;
    const params = (parse(realUrl, true).query as unknown) as ResultListParams;

    let list = mockListDataSource.find(item => id === item.key);

    if (list) {
        let dataSource = list.result;
        let { result: r, ...l } = list;
        dataSource = dataSource.map((item) => { return { ...l, ...item } })
        if (params.market_participant) {
            dataSource = dataSource.filter((data) => data.market_participant.includes(params.market_participant || ''));
        }
        let dataSourceResult = [...dataSource].slice(
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
    } else {
        const result = {
            data: [],
            total: 0,
            success: true,
            pageSize,
            current: parseInt(`${params.currentPage}`, 10) || 1,
        };
        res.json(result);
    }
}

function postResultList(req: Request, res: Response, u: string, b: Request) {
    let realUrl = u;
    if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
        realUrl = req.url;
    }

    const body = (b && b.body) || req.body;
    const { method, name, desc, key } = body;

    switch (method) {
        /* eslint no-case-declarations:0 */
        case 'delete':
            mockResultDataSource = mockResultDataSource.filter((item) => key.indexOf(item.key) === -1);
            break;
        default:
            break;
    }

    const result = {
        list: mockResultDataSource,
        pagination: {
            total: mockResultDataSource.length,
        },
    };

    res.json(result);

}

const proxy = {
    'GET /api/list': getList,
    'POST /api/list': postList,
    'POST /api/list/export': exportList,
    'GET /api/list/result': getResultList,
    'POST /api/list/result': postResultList,
};

export default delay(proxy, 100);