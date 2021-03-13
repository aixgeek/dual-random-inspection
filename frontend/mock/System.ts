/*
 * @Author: June Lue
 * @Date: 2020-09-21 16:19:39
 * @LastEditors: June Lue
 * @LastEditTime: 2020-09-21 17:08:21
 * @FilePath: \wanning\mock\system.ts
 */
// eslint-disable-next-line import/no-extraneous-dependencies
const getSupervisionAdministrationList = {
    data: [{
        key: 1,
        name: '主体监管单位1',
        password: '123456',
        dutyDepartment: '分管执法单位1',
        contractPerson: Math.floor(Math.random() * 1000),
        contractPhone: Math.floor(Math.random() * 1000),
        role: Math.floor(Math.random() * 10) % 2,
        remark: '无',
        updatedAt: new Date(),
        createdAt: new Date(),
    }],
    total: 1,
    success: true,
    pageSize: 5,
    current: 1,
}

const getIndustryTypeList = {
    data: [{
        key: 1,
        name: '主体监管单位1',
        remark: '无',
        updatedAt: new Date(),
        createdAt: new Date(),
    },{
        key: 2,
        name: '主体监管单位1',
        remark: '无',
        updatedAt: new Date(),
        createdAt: new Date(),
    },{
        key: 3,
        name: '主体监管单位1',
        remark: '无',
        updatedAt: new Date(),
        createdAt: new Date(),
    }],
    total: 3,
    success: true,
    pageSize: 5,
    current: 1,
}

export default {
    'GET /api/supervisionAdministration': getSupervisionAdministrationList,
    'POST /api/supervisionAdministration': getSupervisionAdministrationList,
    'GET /api/industryType': getIndustryTypeList,
    'POST /api/industryType': getIndustryTypeList,
};
