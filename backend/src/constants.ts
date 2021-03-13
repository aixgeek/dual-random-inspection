import { SetMetadata } from "@nestjs/common";

// V2 集合名
export const CollectionV2 = {
    // 随机抽查事项清单集合
    InspectionMatters: 'inspection-matters',

    // 执法人员集合
    LawEnforcementOfficials: 'law-enforcement-officials',

    // 市场主体集合
    MarketParticipants: 'market-participants',

    // 执法主体集合
    SupervisionAdministrations: 'supervision-administrations',

    // 双随机任务集合
    DoubleRandomInspections: 'double-random-inspections',

    // 双随机结果集合
    DoubleRandomResults: 'double-random-results',

    // 用户集合
    Users: 'users',
}

// 公开角色，即未登录的用户可访问的资源
export const PublicRole = {
    _id: 'public',
    roleName: '公开用户',
    description: '未登录的用户允许访问的资源',
    // 默认为空
    permissions: [],
    // 不允许删除
    delete: false,
}  

// 公开的访问资源
export const Public = () => SetMetadata( "isPublic", true );
