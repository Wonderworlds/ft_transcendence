import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewayModule } from './gateway/gateway.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { Match } from './typeorm/entities/Match';
import { Message } from './typeorm/entities/Message';
import { Room } from './typeorm/entities/Room';

@Module({
  imports: [
	ConfigModule.forRoot({ isGlobal: true}),
	TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		useFactory: (configService: ConfigService) => ({
			type: 'postgres',
			host: configService.get('POSTGRES_HOSTNAME'),
			port: 5432,
			username: configService.get('POSTGRES_USER'),
			password: configService.get('POSTGRES_PASSWORD'),
			database: configService.get('POSTGRES_DB'),
			entities: [User, Match, Message, Room],
			synchronize: true
		}),
			inject: [ConfigService],
  }), UsersModule, GatewayModule, ThrottlerModule.forRoot([{
	ttl: 10000,
	limit: 2,
  }])],
  controllers: [AppController],
  providers: [AppService, {
	provide: APP_GUARD,
	useClass: ThrottlerGuard,
  }],
})
export class AppModule {}
