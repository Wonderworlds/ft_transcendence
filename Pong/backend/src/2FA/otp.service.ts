import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from 'src/typeorm/entities/Otp';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class OtpService {
  constructor(@InjectRepository(Otp) private otpRepository: Repository<Otp>) {}

  generateOTP = (n: number): string => {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < n; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }

    return otp;
  };

  async createOtpEntity(otp: otpDto) {
	const tsmp = new Date().getTime();
    const otpDB = this.otpRepository.create({
      ...otp,
      expiresAt: new Date(tsmp + (5 * 60000)),
    });
    return await this.otpRepository.save(otpDB);
  }
}

export class otpDto {
  owner: User;
  code: string;
}
