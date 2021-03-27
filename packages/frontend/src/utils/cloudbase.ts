import cloudbase from "@cloudbase/js-sdk";

let app: any;
let auth: any;

initCloudBaseApp()

/**
 * 初始化 CloudBase App 实例
 */
export async function initCloudBaseApp() {
  if (!app) {
    app = cloudbase.init({
      env: 'wanning-open-0gbztc9h2bcb19f0'
    });
  }

  if (!auth) {
    auth = app.auth({ persistence: 'local' });
  }
}

/**
 * 获取 CloudBase App 实例
 */
export async function getCloudBaseApp() {
  // const loginState = await auth.getLoginState()

  // if (!loginState) {
  //   history.push('/user/login')
  // }

  return app
}

/**
 * 账号密码登陆
 */
export async function loginWithUsernameAndPassword(username: string, password: string) {
  // 登陆
  await auth.signInWithUsernameAndPassword(username, password)
}

/**
 * 退出登录
 */
export async function logout() {
  await auth.signOut()
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
  await app.downloadFile({
    fileID: cloudId,
  });
}
