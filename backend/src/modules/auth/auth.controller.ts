import { Controller, Get, Post, Body, Request } from '@nestjs/common'
import { getCloudBaseApp } from '@/utils'
import { CollectionV2, Public } from '@/constants'
import { IsNotEmpty } from 'class-validator';

class LoginDTO {
  @IsNotEmpty()
  username: string
  @IsNotEmpty()
  password: string
}

@Controller('')
export class AuthController {

  @Get('currentUser')
  async getCurrentUser(@Request() req: AuthRequest) {

    const { authUser } = req
    return authUser
  }

  @Public()
  @Post('login')
  async login(
    @Body() body: LoginDTO,
    @Request() req: AuthRequest) {

    const app = getCloudBaseApp()

    const {
      data: [userRecord],
    } = await app
      .database()
      .collection(CollectionV2.Users)
      .where({
        username: body.username,
        password: body.password
      })
      .get()
    if (userRecord) {
      // 开发者自有账号体系下的唯一用户ID
      const customUserId = userRecord._id;
      // 创建ticket
      const ticket = app.auth().createTicket(customUserId, {
        refresh: 10 * 60 * 1000 // 每十分钟刷新一次登录态， 默认为一小时
      });
      // 将ticket返回客户端
      return ticket;
    }
  }

  @Get('login/outLogin')
  async outLogin(@Request() req: AuthRequest) {

    return {
      data: {},
      success: true
    }
  }
}
