import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/typeorm/entities/Match';
import { User } from 'src/typeorm/entities/User';
import { UserController } from './user.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Match])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController, UserController]
})
export class UsersModule {}
