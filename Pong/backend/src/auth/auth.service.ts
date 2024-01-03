import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm/entities/User';
import { UsersService } from 'src/users/users.service';
import { LogInUserDto, SecureUserDto, UserDto } from 'src/utils/dtos';
import { Status } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async createUser(userToLog: LogInUserDto): Promise<User> {
    let pseudo: string = userToLog.username;
    let found = await this.userService.findUserByPseudo(pseudo);
    let step = 0;
    while (found) {
      pseudo.concat(step.toString());
      found = await this.userService.findUserByPseudo(pseudo);
      step++;
    }
    const newUser: SecureUserDto = {
      ...userToLog,
      pseudo: pseudo,
      status: Status.Online,
      ppImg: 'PP_default.png',
    };
    return await this.userService.createUserDB(newUser);
  }

  async onLoginLogic(userToLog: LogInUserDto) {
    const user: User = await this.userService.findUserByUsername(
      userToLog.username,
    );
    if (!user) {
      const newUser = await this.createUser(userToLog);
      const payload = {
        sub: newUser.id,
        user: this.userService.userToDto(newUser),
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new BadRequestException('User already loggedIn');
    }
  }
}
