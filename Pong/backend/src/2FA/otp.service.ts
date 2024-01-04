import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from 'src/typeorm/entities/Otp';
import { User } from 'src/typeorm/entities/User';
import { myDebug } from 'src/utils/DEBUG';
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

  async findOtpLinked(id: number) {
    return await this.otpRepository.findOneBy({ ownerId: id });
  }

  async createOtpEntity(otp: otpDto) {
    myDebug('createOtpEntity', otp);
    const oldOtp = await this.findOtpLinked(otp.ownerId);
    if (oldOtp) this.destroyOtp(oldOtp);
    const tsmp = new Date().getTime();
    const otpDB = this.otpRepository.create({
      ...otp,
      expiresAt: new Date(tsmp + 5 * 60000),
    });
    return await this.otpRepository.save(otpDB);
  }

  isTokenExpired(expiry: Date): boolean {
    const currentDate = new Date();
    return expiry.getTime() <= currentDate.getTime();
  }

  async destroyOtp(otp: Otp) {
    return await this.otpRepository.delete(otp.id);
  }
}

export class otpDto {
  owner: User;
  code: string;
  ownerId: number;
}
