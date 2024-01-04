import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { UsersController } from './users.controller';
import { Match } from 'src/typeorm/entities/Match';
import { OtpService } from 'src/2FA/otp.service';
import { OtpModule } from 'src/2FA/otp.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Match]), OtpModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
