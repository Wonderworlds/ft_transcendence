import { Module } from '@nestjs/common';
import { Otp } from 'src/typeorm/entities/Otp';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([Otp, User])],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
