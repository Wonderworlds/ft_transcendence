import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { Profile } from './typeorm/entities/Profile';
import { Post } from './typeorm/entities/Post';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
			entities: [User, Profile, Post],
			synchronize: true
		}),
			inject: [ConfigService],
  }), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
