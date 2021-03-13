import { CollectionV2 } from '@/constants'
import { Reflector } from "@nestjs/core";
import { getCloudBaseApp, isDevEnv } from '@/utils'
import cloudbase from '@cloudbase/node-sdk'
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { Request } from 'express'

// 校验用户是否登录，是否存在
@Injectable()
export class GlobalAuthGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>("isPublic", context.getHandler());
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthRequest & Request>()

    if (isDevEnv()) {
      request.authUser = {
        _id: 'devtest',
        username: '万宁市市场监督管理局',
        access: 'admin',
        name: '万宁市市场监督管理局',
        supervisionAdministrations: [
          "*",
        ],
      }

      // request.cmsUser = {
      //     _id: 'test',
      //     roles: ['content:administrator'],
      //     username: 'admin',
      //     createTime: 2020,
      //     uuid: 'xxx'
      // }

      // request.cmsUser = {
      //   _id: 'test',
      //   roles: ['public'],
      //   username: '_anonymous',
      //   createTime: 2020,
      //   isAdmin: false,
      //   uuid: '',
      // }

      return true
    }

    // 获取用户信息
    // 目前只在云函数中能自动获取用户身份信息
    const app = getCloudBaseApp()
    const { TCB_UUID } = cloudbase.getCloudbaseContext()
    const { userInfo } = await app.auth().getEndUserInfo(TCB_UUID)

    // 未登录用户
    if (!userInfo?.customUserId) {
      throw new HttpException(
        {
          code: 'NO_AUTH',
          message: '未登录用户',
        },
        HttpStatus.FORBIDDEN
      )
    }

    const {
      data: [userRecord],
    } = await app
      .database()
      .collection(CollectionV2.Users)
      .where({
        _id: userInfo.customUserId,
      })
      .get()

    // 用户信息不存在
    if (!userRecord) {
      throw new HttpException(
        {
          error: {
            code: 'AUTH_EXPIRED',
            message: '用户不存在，请确认登录信息！',
          },
        },
        HttpStatus.FORBIDDEN
      )
    }

    request.authUser = userRecord

    return true
  }
}