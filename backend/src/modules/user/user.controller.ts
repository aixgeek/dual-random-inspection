import {
  Post,
  Body,
  Get,
  Query,
  Delete,
  Param,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Patch,
} from '@nestjs/common'
import _ from 'lodash'
import { CollectionV2 } from '@/constants'
import { dateToNumber } from '@/utils'
import { CloudBaseService } from '@/services'
import { RecordExistException, RecordNotExistException, UnauthorizedOperation } from '@/common'
import { UserService } from './user.service'
import { User } from './user.dto'

@Controller('user')
export class UserController {
  constructor(
    private readonly cloudbaseService: CloudBaseService,
    private readonly userService: UserService
  ) { }

  // 获取所有用户
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getUsers(@Query() query: { page?: number; pageSize?: number } = {}) {
    const { page = 1, pageSize = 10 } = query

    let { data, requestId } = await this.cloudbaseService
      .collection(CollectionV2.Users)
      .where({})
      .skip(Number(page - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .get()

    data = data.map((_) => ({
      ..._,
      username: _.username,
    }))

    return {
      data,
      requestId,
    }
  }

  // 创建用户
  @Post()
  async createUser(@Body() body: User) {
    // 检查同名用户是否存在
    const { data } = await this.cloudbaseService
      .collection(CollectionV2.Users)
      .where({
        username: body.username,
      })
      .get()

    if (data?.length) {
      throw new RecordExistException('同名用户已存在')
    }

    // 不存储密码
    // const user = _.omit(body, ['password'])

    return this.collection(CollectionV2.Users).add({
      ...body,
    })
  }

  private collection(name = CollectionV2.Users) {
    return this.cloudbaseService.collection(name)
  }
}
