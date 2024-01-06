import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/typeorm/entities/Match';
import { User } from 'src/typeorm/entities/User';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [MulterModule.register({dest: './shared/img/'}), TypeOrmModule.forFeature([User, Match])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
