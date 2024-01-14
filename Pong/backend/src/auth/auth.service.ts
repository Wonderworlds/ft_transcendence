import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createMail, transporter } from 'src/2FA/nodemailer';
import { OtpService } from 'src/2FA/otp.service';
import { User } from 'src/typeorm/entities/User';
import { UsersService } from 'src/users/users.service';
import { myDebug } from 'src/utils/DEBUG';
import { LogInUserDto, SecureUserDto } from 'src/utils/Dtos';
import { Status } from 'src/utils/types';
import { JWTPayload } from './utils';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  async createUser(userToLog: LogInUserDto): Promise<User> {
    let found = await this.userService.findUserByUsername(userToLog.username);
    if (found) throw new BadRequestException('Username is taken');
    let pseudo: string = userToLog.username;
    found = await this.userService.findUserByPseudo(pseudo);
    let step = 0;
    while (found) {
      pseudo = pseudo.concat(step.toString());
      found = await this.userService.findUserByPseudo(pseudo);
      console.info(found);
      step++;
    }
    userToLog.password = await bcrypt.hash(userToLog.password, 10);
    const newUser: SecureUserDto = {
      ...userToLog,
      pseudo: pseudo,
      status: Status.Offline,
      ppImg: `${process.env.VITE_BURL}/public/pp_default.png`,
    };
    return await this.userService.createUserDB(newUser);
  }

  async validateUser(
    userToLog: LogInUserDto,
    user?: User,
  ): Promise<JWTPayload> {
    myDebug('validateUser');
    if (!user) {
      user = await this.userService.findUserByUsername(userToLog.username);
    }
    if (!user) throw new BadRequestException('User not found');
    if (user.status !== Status.Offline) throw new BadRequestException('User already connected');
    const passwordValid = await bcrypt.compare(
      userToLog.password,
      user.password,
    );
    if (passwordValid) {
      return {
        sub: user.id,
        user: user,
      };
    }
    throw new BadRequestException('Password incorrect');
  }

  async login(payload: JWTPayload) {
    const miniPayload = { sub: payload.sub, user: payload.user.username };
    return {
      success: true,
      access_token: await this.jwtService.signAsync(miniPayload),
      username: payload.user.username,
      twoFA: payload.user.twoFA,
    };
  }

  async sendMailOtp(user: User) {
    myDebug('sendMailOtp', user);
    const otp = this.otpService.generateOTP(6);
    const hashcode = await bcrypt.hash(otp, 10);
    const res = await this.otpService.createOtpEntity({
      owner: user,
      code: hashcode,
      ownerId: user.id,
    });
    const mail = createMail({
      to: user.email,
      text: `Use this code ${otp} to verify the email registered on your account`,
    });
    console.info(mail);
    transporter.sendMail(mail, (error, info) => {
      if (error) return console.info(error);
      else console.info('Email envoye ' + info.response);
    });
  }

  async ValidateCodeOtp(user: User, code: string) {
    const otp = await this.otpService.findOtpLinked(user.id);
    if (!otp) throw new HttpException('Otp not found', HttpStatus.NOT_FOUND);
    const isExpired = this.otpService.isTokenExpired(otp.expiresAt);
    if (isExpired) {
      this.otpService.destroyOtp(otp);
      throw new HttpException('Otp is expired', HttpStatus.NOT_FOUND);
    }
    const passwordValid = await bcrypt.compare(code, otp.code);
    if (passwordValid) {
      this.otpService.destroyOtp(otp);
      return await this.login({ sub: user.id, user: user } as JWTPayload);
    }
    else
      throw new HttpException('Code not valid', HttpStatus.NOT_FOUND);
  }
}
