import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm/entities/User';
import { UsersService } from 'src/users/users.service';
import { LogInUserDto, SecureUserDto } from 'src/utils/dtos';
import { Status } from 'src/utils/types';
import * as bcrypt from 'bcrypt';
import { myDebug } from 'src/utils/DEBUG';
import { JWTPayload } from './utils';
import { OtpService } from 'src/2FA/otp.service';
import { createMail, transporter } from 'src/2FA/nodemailer';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    ) {}

  async createUser(userToLog: LogInUserDto): Promise<User> {
		let found = await this.userService.findUserByUsername(userToLog.username);
    if (found)
			throw new BadRequestException('Username is taken');
		let pseudo: string = userToLog.username;
    found = await this.userService.findUserByPseudo(pseudo);
    let step = 0;
    while (found) {
      pseudo.concat(step.toString());
      found = await this.userService.findUserByPseudo(pseudo);
      step++;
    }
    userToLog.password = await bcrypt.hash(userToLog.password, 10);
    const newUser: SecureUserDto = {
      ...userToLog,
      pseudo: pseudo,
      status: Status.Offline,
      ppImg: 'pp_default.png',
    };
    return await this.userService.createUserDB(newUser);
  }

  async validateUser(userToLog: LogInUserDto, user?: User) : Promise<JWTPayload> {
		myDebug('validateUser');
    if (!user) {
      user = await this.userService.findUserByUsername(userToLog.username);
    }
		if (!user)
  		throw new BadRequestException('User not found');
    if (user.status === Status.Online)
      throw new BadRequestException('User already loggedIn');
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
		myDebug('login');
    const miniPayload = {sub: payload.sub, user: payload.user.username};
		return {
			success: true,
      access_token: await this.jwtService.signAsync(miniPayload),
			username: payload.user.username,
      twoFA: payload.user.twoFA,
		};
  }

  
  async sendMailOtp(req: Request) {
    const userDetails : JWTPayload = req['user'];
    const user = await this.userService.findUserById(userDetails.sub)
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const otp = this.otpService.generateOTP(6);
    const res = await this.otpService.createOtpEntity({owner: user, code: otp});
    console.info(res);
    const mail = createMail(
      {to: user.email,
      text: `Use this code ${otp} to verify the email registered on your account`,
    });
    console.info(mail);
    transporter.sendMail(mail, (error, info) => {
      if (error)
        return console.info(error);
      else
        console.info("Email envoye" + info.response);
    });
    return { success: true };
  }
}
