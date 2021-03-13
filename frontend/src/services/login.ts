import { tcbRequest } from '@/utils';
import { request } from 'umi';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

export async function getLoginTicket(params: LoginParamsType) {
  return request(
    'https://wanning-open-0gbztc9h2bcb19f0-1300942068.ap-shanghai.service.tcloudbase.com/wanning-backend/api/login',
    {
      method: 'POST',
      data: params,
    },
  );
}

export async function getFakeCaptcha(mobile: string) {
  return tcbRequest(`/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return tcbRequest('/login/outLogin');
}
