import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Partial<RequestUser>) {
    const payload = {
      sub: user.userId,
      username: user.username,
      supervisionAdministrations: user.supervisionAdministrations,
    };
    return {
      statusCode: 200,
      access_token: this.jwtService.sign(payload),
    };
  }
}
