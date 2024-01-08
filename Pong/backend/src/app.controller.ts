import { Controller, Get } from '@nestjs/common';
import { SkipAuth } from './auth/utils';

@Controller()
export class AppController {

	@SkipAuth()
	@Get()
	GetHello() {
		return 'Hello World! Transcendence is running!';
	}
}