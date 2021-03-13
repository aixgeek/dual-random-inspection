/*
 * @Author: June Lue
 * @Date: 2020-09-17 13:57:15
 * @LastEditors: June Lue
 * @LastEditTime: 2020-09-21 17:43:54
 * @FilePath: \wanning\config\defaultSettings.ts
 */
import { Settings as LayoutSettings } from '@ant-design/pro-layout';

export default {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: '万宁市双随机一公开抽查系统',
  pwa: false,
  iconfontUrl: '',
  globalPrefix: '/api',
  logo: false,
} as LayoutSettings & {
  pwa: boolean;
  globalPrefix: string;
};
