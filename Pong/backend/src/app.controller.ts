import { Controller, Get, Render } from '@nestjs/common';
import { SkipAuth } from './auth/utils';

@Controller()
export class AppController {
  @SkipAuth()
  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }
}