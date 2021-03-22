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
        path: '/system/industry-type',
        name: '监管行业管理',
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
        path: '/double-random/start',
        name: '一般抽查',
        hideChildrenInMenu: true,
      },
      {
        path: '/double-random/history',
        name: '一般抽查历史记录',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/double-random/history/:id',
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
    path: '/open',
    name: '抽查结果公示',
    icon: 'table',
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
