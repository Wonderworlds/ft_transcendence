import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthDto, LogInUserDto, TwoFADto } from 'shared/src/Dtos';
import { Success } from 'shared/src/types';
import { myDebug } from 'src/utils/DEBUG';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.auth.guard';
import { SkipAuth } from './utils';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @SkipAuth()
  @Post('/signup')
  async signUp(
    @Body() secureUser: LogInUserDto,
  ): Promise<Success | HttpException> {
    secureUser.username = secureUser.username.toLowerCase();
    await this.authService.createUser(secureUser);
    return { success: true };
  }

  @HttpCode(200)
  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async logIn(
    @Req() req: any,
  ): Promise<AuthDto | { username: string } | HttpException> {
		console.log(process.cwd());
    myDebug('login', req.user);
    if (req.user.user.twoFA) {
      await this.authService.sendMailOtp(req.user.user);
      return { username: req.user.user.username };
    } else return await this.authService.login(req.user);
  }

  @HttpCode(200)
  @Get()
  isLoggedIn(@Session() session: Record<string, any>) {
    console.info(session);
    return;
  }

  @HttpCode(200)
  @Get('/user')
  getUser(@Req() req: any) {
    console.info(req.user);
    return req.user;
  }

  @HttpCode(200)
  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('/twoFA')
  verifyCode(
    @Req() request: any,
    @Body() body: TwoFADto,
  ): Promise<AuthDto | HttpException> {
    myDebug('twoFA', request.user, body);
    return this.authService.ValidateCodeOtp(request.user.user, body.code);
  }
}
