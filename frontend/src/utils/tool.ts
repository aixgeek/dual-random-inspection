// 判断是否是开发环境
export const isDevEnv = () => process.env.NODE_ENV === 'development';

export const isProduction = () => process.env.NODE_ENV !== 'development';
