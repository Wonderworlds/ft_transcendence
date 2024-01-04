import { Module } from '@nestjs/common';
import { Otp } from 'src/typeorm/entities/Otp';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
