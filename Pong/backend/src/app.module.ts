import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { Profile } from './typeorm/entities/Profile';
import { Post } from './typeorm/entities/Post';

@Module({
  imports: [TypeOrmModule.forRoot({
	type: 'postgres',
	host: 'postgres',
	port: 5432,
	username: 'postgres',
	password: 'mdp',
	database: 'pong_db',
	entities: [User, Profile, Post],
	synchronize: true
  }), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
