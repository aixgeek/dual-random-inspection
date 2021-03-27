export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    name: '欢迎',
    icon: 'smile',
    component: './welcome/Index',
  },
  {
    name: '系统管理',
    icon: 'appstore',
    path: '/system',
    routes: [
      {
        path: '/system/supervision-administration',
        name: '执法主体管理',
        component: './system/SupervisionAdministration',
      },
      {
        path: '/system/duty-department',
        name: '分管部门管理',
        component: './system/DutyDepartment',
      },
      {
        path: '/system/industry-type',
        name: '行业类型管理',
        component: './system/IndustryType',
      },
    ],
  },
  {
    path: '/data-entry',
    name: '两库一清单',
    icon: 'table',
    routes: [
      {
        path: '/data-entry/market-participant',
        name: '市场主体名录',
        component: './data-entry/MarketParticipant',
      },
      {
        path: '/data-entry/law-enforcement-official',
        name: '检查人员名单',
        component: './data-entry/LawEnforcementOfficial',
      },
      {
        path: '/data-entry/inspected-matter',
        name: '随机抽查事项清单',
        component: './data-entry/InspectionMatter',
      },
    ],
  },
  {
    name: '双随机业务',
    icon: 'dashboard',
    path: '/double-random',
    component: './double-random',
    routes: [
      {
        path: '/double-random/welcome',
        name: '功能介绍',
        hideInMenu: true,
      },
      {
        path: '/double-random/normal',
        name: '一般抽查',
        hideChildrenInMenu: true,
      },
      {
        path: '/double-random/normalHistory',
        name: '一般抽查历史记录',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/double-random/normalHistory/:id',
            name: '一般抽查结果',
          },
        ],
      },
      {
        path: '/double-random/cooperation',
        name: '联合抽查',
        hideChildrenInMenu: true,
      },
      {
        path: '/double-random/cooperationHistory',
        name: '联合抽查历史记录',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/double-random/cooperationHistory/:id',
            name: '联合抽查结果',
          },
        ],
      }
    ],
  },
  {
    path: '/public',
    name: '市场主体公共库',
    icon: 'database',
    component: './public/Index',
  },
  {
    path: '/open',
    name: '抽查结果公示',
    icon: 'audit',
    component: './open/Index',
    access: 'canGuest',
    layout: false
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
