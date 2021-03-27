import * as cloudbase from '@cloudbase/node-sdk';
import config from '../config';

// 从环境变量中读取
export const getEnvIdString = (): string => {
  const { TCB_ENV, SCF_NAMESPACE, ENVID } = process.env;
  return TCB_ENV || SCF_NAMESPACE || ENVID;
};

export const getCloudBaseApp = () => {
  const envId = getEnvIdString();

  const options = {
    env: envId || config.ENVID,
    secretId: process.env.SECRETID || config.SECRETID,
    secretKey: process.env.SECRETKEY || config.SECRETKEY,
  };

  const app = cloudbase.init(options);

  return app;
};
