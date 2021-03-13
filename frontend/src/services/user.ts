import { tcbRequest } from '@/utils';

export async function query() {
  return tcbRequest<API.CurrentUser[]>('/users');
}

export async function queryCurrent() {
  return tcbRequest<API.CurrentUser>('/currentUser');
}

export async function queryNotices(): Promise<any> {
  return tcbRequest<{ data: API.NoticeIconData[] }>('/notices');
}
