import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { UsersController } from './users.controller';
import { Match } from 'src/typeorm/entities/Match';

@Module({
  imports: [TypeOrmModule.forFeature([User, Match])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
