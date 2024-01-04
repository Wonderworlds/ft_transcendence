import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Request,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInUserDto, UserDto } from 'src/utils/dtos';
import { LocalAuthGuard } from './local.auth.guard';
import { SkipAuth } from './utils';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @SkipAuth()
  @Post('/signup')
  signUp(@Body() secureUser: LogInUserDto) {
    secureUser.username = secureUser.username.toLowerCase();
    return this.authService.createUser(secureUser);
  }

  @HttpCode(200)
  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  logIn(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @HttpCode(200)
  @Get()
  isLoggedIn(
    @Session() session: Record<string, any>,
  ): Promise<UserDto> | undefined {
    console.info(session);
    return;
  }

  @HttpCode(200)
  @Get('/user')
  getUser(@Req() req: any) {
    console.info(req.user);
    return req.user;
  }

  @Post('/user')
  PostUser(@Req() req: any, @Body() body: any) {
    console.info(req.user);
    console.info(body);
    return body;
  }

  @HttpCode(200)
  @Post('/email')
  verifyEmail(@Req() request: any) {
    console.info(request.user);
    return this.authService.sendMailOtp(request);
  }
}
