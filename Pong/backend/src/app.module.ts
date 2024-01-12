import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { OtpModule } from './2FA/otp.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { PongModule } from './pong/pong.module';
import { Match } from './typeorm/entities/Match';
import { Otp } from './typeorm/entities/Otp';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', './public'),
      serveRoot: '/public/',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOSTNAME'),
        port: 5432,
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User, Match, Otp],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PongModule,
    ThrottlerModule.forRoot([
      {
        name: 'veryShort',
        ttl: 200,
        limit: 1,
      },
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
    AuthModule,
    OtpModule,
    ChatModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }, { provide: APP_GUARD, useClass: ThrottlerGuard}],
})
export class AppModule {}
