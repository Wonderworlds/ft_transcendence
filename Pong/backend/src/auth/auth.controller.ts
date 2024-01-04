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
import { CodeDto, LogInUserDto, UserDto } from 'src/utils/dtos';
import { LocalAuthGuard } from './local.auth.guard';
import { SkipAuth } from './utils';
import { myDebug } from 'src/utils/DEBUG';

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
  async logIn(@Req() req: any) {
    myDebug('login', req.user);
    if (req.user.user.twoFA) {
      await this.authService.sendMailOtp(req.user.user);
      return { username: req.user.user.username };
    } else return await this.authService.login(req.user);
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
  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('/twoFA')
  verifyCode(@Req() request: any, @Body() body: any) {
    myDebug('twoFA', request.user, body);
    return this.authService.ValidateCodeOtp(request.user.user, body.code);
  }
}
