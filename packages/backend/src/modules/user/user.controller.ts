import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../auth/auth.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Public()
  @Post('currentUser')
  async currentUser(@Body() body: Partial<RequestUser>) {
    return body;
  }
}
