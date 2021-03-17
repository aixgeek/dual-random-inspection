/*
 * @Author: June Lue
 * @Date: 2020-09-17 13:57:15
 * @LastEditors: June Lue
 * @LastEditTime: 2020-09-21 17:30:09
 * @FilePath: \wanning\config\config.ts
 */
// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  history: {
    type: 'hash',
  },
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: '万宁市双随机一公开抽查系统',
    locale: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/welcome',
      name: 'welcome',
      icon: 'smile',
      component: './welcome/Index',
    },
    {
      name: 'system',
      icon: 'appstore',
      path: '/system',
      routes: [
        {
          path: '/system/supervision-administration',
          name: 'supervision-administration',
          component: './system/SupervisionAdministration',
        },
        {
          path: '/system/industry-type',
          name: 'industry-type',
          component: './system/IndustryType',
        },
      ],
    },
    {
      path: '/data-entry',
      name: 'data-entry',
      icon: 'table',
      routes: [
        {
          path: '/data-entry/market-participant',
          name: 'market-participant',
          component: './data-entry/MarketParticipant',
        },
        {
          path: '/data-entry/law-enforcement-official',
          name: 'law-enforcement-official',
          component: './data-entry/LawEnforcementOfficial',
        },
        {
          path: '/data-entry/inspected-matter',
          name: 'inspected-matter',
          component: './data-entry/InspectionMatter',
        },
      ],
    },
    {
      name: 'double-random',
      icon: 'dashboard',
      path: '/double-random',
      component: './double-random',
      routes: [
        {
          path: '/double-random/start',
          name: 'start',
          hideChildrenInMenu: true,
        },
        {
          path: '/double-random/cooperation',
          name: 'cooperation',
          hideChildrenInMenu: true,
        },
        {
          path: '/double-random/history',
          name: 'history',
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/double-random/history/:id',
              name: 'result',
            },
          ],
        },
        {
          path: '/double-random/open',
          name: 'open',
          layout: false,
        },
      ],
    },
    {
      path: '/',
      redirect: '/welcome',
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
