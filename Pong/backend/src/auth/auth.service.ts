import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm/entities/User';
import { UsersService } from 'src/users/users.service';
import { LogInUserDto, SecureUserDto, UserDto } from 'src/utils/dtos';
import { JWTPayload, Status } from 'src/utils/types';
import * as bcrypt from 'bcrypt';
import { debug } from 'src/utils/DEBUG';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
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
      ppImg: 'PP_default.png',
    };
    return await this.userService.createUserDB(newUser);
  }

  async validateUser(userToLog: LogInUserDto, user?: User) : Promise<JWTPayload> {
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
        user: user.username,
      };
    }
    throw new BadRequestException('Password incorrect');
  }

  async login(user: JWTPayload) {
		debug('login', user);
		return {
			access_token: await this.jwtService.signAsync(user),
			username: user.user
		};
  }
}
