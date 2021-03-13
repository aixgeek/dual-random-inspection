import { NestFactory } from '@nestjs/core';
import express from 'express'
import bodyParser from 'body-parser'
import { Reflector } from "@nestjs/core";
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import config from './config'
import { TimeCost } from './interceptors/timecost.interceptor'
import { GlobalAuthGuard } from './guards/auth.guard'
import { AppModule } from './app.module';

const expressApp = express()
const adapter = new ExpressAdapter(expressApp)
const port = process.env.PORT || 5000

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, adapter, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  })

  // API 版本
  app.setGlobalPrefix(config.globalPrefix)

  // 参数校验
  app.useGlobalPipes(new ValidationPipe())

  // 登录校验
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new GlobalAuthGuard(reflector))

  // 请求 body 大小限制
  app.use(bodyParser.raw({ limit: '50mb' }))

  // 耗时
  app.useGlobalInterceptors(new TimeCost())

  // cors
  app.enableCors({
    origin: (requestOrigin: string, callback: (err: Error | null, allow?: boolean) => void) => {
      callback(null, true)
    },
    maxAge: 600,
    credentials: true,
  })

  // hide x-powered-by: express header
  app.disable('x-powered-by')

  // 兼容云函数与本地开发
  if (process.env.NODE_ENV === 'development') {
    await app.listen(port)
  } else {
    await app.init()
  }

  return expressApp
}

if (process.env.NODE_ENV === 'development') {
  bootstrap().then(() => {
    console.log('进程id:', process.pid)
    console.log(`App listen on http://localhost:${port}`)
  })
}

