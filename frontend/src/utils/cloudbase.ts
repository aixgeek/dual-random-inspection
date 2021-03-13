import { request, history } from 'umi';
import { message, notification } from 'antd';
import { RequestOptionsInit } from 'umi-request';
import { codeMessage } from '@/constants';
import { isDevEnv } from './tool';
import defaultSettings from '../../config/defaultSettings';
import { getFullDate } from './date';

let app: any;
let auth: any;

export async function getCloudBaseApp() {
  if (!app) {
    const { envId } = window.TcbCmsConfig || {};
    app = window.cloudbase.init({
      env: envId,
      // 默认可用区为上海
      region: window.TcbCmsConfig.region || 'ap-shanghai',
    });
  }

  if (!auth) {
    auth = app.auth({ persistence: 'local' });
  }

  const loginState = await auth.getLoginState();

  if (!loginState && !isDevEnv()) {
    message.error('您还没有登录或登录已过期，请登录后再操作！');
    history.push('/login');
  }

  return app;
}

// 用户名Ticket登录
export async function loginWithTicket(ticket: any) {
  if (!auth) {
    await getCloudBaseApp();
  }
  await auth.customAuthProvider().signIn(ticket);
}

export async function logout() {
  if (!auth) {
    await getCloudBaseApp();
  }
  await auth.signOut();
}

// 兼容本地开发与云函数请求
export async function tcbRequest<T = any>(
  url: string,
  options: RequestOptionsInit & { skipErrorHandler?: boolean } = {},
) {
  if (url === '/auth/login' && !isDevEnv()) {
    return request<T>(`${defaultSettings.globalPrefix}${url}`, options);
  }

  if (isDevEnv()) {
    return request<T>(`${defaultSettings.globalPrefix}${url}`, options);
  }

  const { method, params, data } = options;
  app = await getCloudBaseApp();

  const res = await app.callFunction({
    name: 'wanning-backend',
    data: {
      path: `${defaultSettings.globalPrefix}${url}`,
      httpMethod: method,
      queryStringParameters: params,
      body: data,
    },
  });

  if (res.result?.statusCode === 500) {
    notification.error({
      message: '请求错误',
      description: `服务异常：${url}`,
    });
    throw new Error('服务异常');
  }

  // 转化响应值
  let body;
  try {
    body = JSON.parse(res.result.body);
  } catch (error) {
    console.log(error);
    body = {};
  }

  if (body?.error) {
    const errorText = codeMessage[res.result?.statusCode || 500];
    notification.error({
      message: errorText,
      description: `请求错误：【${body.error.code}】: ${body.error.message}`,
    });
    throw new Error('服务异常');
  }

  return body;
}

// 上传文件
export async function uploadFile(
  file: File,
  onProgress: (v: number) => void,
  filePath?: string,
): Promise<string> {
  app = await getCloudBaseApp();
  const day = getFullDate();

  // 文件名
  const uploadFilePath = filePath || `upload/${day}/${file.name}`;

  const result = await app.uploadFile({
    filePath: file,
    cloudPath: `wanning/${uploadFilePath}`,
    onUploadProgress: (progressEvent: ProgressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(percentCompleted);
    },
  });

  return result.fileID;
}

// 获取文件的临时访问链接
export async function getTempFileURL(cloudId: string): Promise<string> {
  app = await getCloudBaseApp();
  const result = await app.getTempFileURL({
    fileList: [cloudId],
  });

  if (result.fileList[0].code !== 'SUCCESS') {
    throw new Error(result.fileList[0].code);
  }

  return result.fileList[0].tempFileURL;
}

/**
 * 批量获取文件临时访问链接
 */
export async function batchGetTempFileURL(
  cloudIds: string[],
): Promise<
  {
    fileID: string;
    tempFileURL: string;
  }[]
> {
  app = await getCloudBaseApp();
  const result = await app.getTempFileURL({
    fileList: cloudIds,
  });

  result.fileList.forEach((ret: any) => {
    if (ret.code !== 'SUCCESS') {
      throw new Error(ret.code);
    }
  });

  return result.fileList;
}

// 下载文件
export async function downloadFile(cloudId: string) {
  app = await getCloudBaseApp();

  const result = await app.downloadFile({
    fileID: cloudId,
  });

  console.log('下载文件', cloudId, result);
}
