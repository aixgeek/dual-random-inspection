import { NestFactory, Reflector } from '@nestjs/core';
import {
  NestExpressApplication,
  ExpressAdapter,
} from '@nestjs/platform-express';
import * as express from 'express';
import { JwtAuthGuard } from '@/modules/auth/auth.guard';
import { AppModule } from './app.module';
import config from './config';

export async function bootstrap() {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    adapter,
  );

  // API 版本
  app.setGlobalPrefix(config.globalPrefix);

  // 登录校验
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.init();

  return expressApp;
}

// 注意: 通过注入 NODE_ENV 为 local，来方便本地启动服务，进行开发调试
const isLocal = process.env.NODE_ENV === 'development';
if (isLocal) {
  bootstrap().then((app) => {
    app.listen(3000, () => {
      console.log(`App start on http://localhost:3000`);
    });
  });
}
