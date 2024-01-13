import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/typeorm/entities/Match';
import { User } from 'src/typeorm/entities/User';
import { myDebug } from 'src/utils/DEBUG';
import {
  LimitedUserDto,
  MatchDto,
  SecureUserDto,
  UserDto,
  UserDtoEmail,
  UserDtoPPImg,
  UserDtoPassword,
  UserDtoPseudo,
  UserDtoStatus,
  UserDtoTwoFA,
  UserDtoUsername,
} from 'src/utils/Dtos';
import { Success } from 'src/utils/types';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Match) private matchRepository: Repository<Match>,
  ) {}

  async createUserDB(user: SecureUserDto): Promise<User> {
    const newUser = this.userRepository.create({
      ...user,
    });
    myDebug('createUserDB', newUser);
    return await this.userRepository.save(newUser);
  }

  async getMe(id: number): Promise<UserDto> {
    const user = await this.findOneUser(
      { id: id },
      [],
      ['username', 'twoFA', 'email', 'pseudo', 'ppImg', 'status'],
    );
    if (!user) throw new BadRequestException('User Not Found');
    return user;
  }

  async findUserByPseudo(pseudo: string): Promise<User> | undefined {
    const user = await this.userRepository.findOneBy({ pseudo: pseudo });
    return user;
  }

  async findUserByUsername(username: string): Promise<User> | undefined {
    const user = await this.userRepository.findOneBy({ username: username });
    return user;
  }

  async findUserById(id: number): Promise<User> | undefined {
    const user = await this.userRepository.findOneBy({ id: id });
    return user;
  }

  async updateUserById(
    id: number,
    user:
      | UserDtoEmail
      | UserDtoTwoFA
      | UserDtoPseudo
      | UserDtoPPImg
      | UserDtoStatus
      | UserDtoPassword,
  ) {
    const res = await this.userRepository.update({ id }, { ...user });
    return res;
  }

  async updateUserByUsername(
    username: string,
    user:
      | UserDtoEmail
      | UserDtoTwoFA
      | UserDtoPseudo
      | UserDtoPPImg
      | UserDtoStatus
      | UserDtoPassword,
  ) {
    const res = await this.userRepository.update({ username }, { ...user });
    return res;
  }

  async getPPImg(id: number, @Res() res) {
    const user = await this.findUserById(id);
    if (!user) throw new BadRequestException('Img not Found');
    return user.ppImg;
  }

  async getMatchHistory(user: User): Promise<Array<MatchDto>> {
    const matchs = await this.matchRepository.find({
      where: [{ winner: user }, { loser: user }],
      relations: ['winner', 'loser'],
      order: { createdAt: 'DESC' },
    });
    const ret: Array<MatchDto> = [];
    matchs.forEach((match) => {
      const won = match.winner.id === user.id;
      ret.push({
        p1: match.p1,
        p2: match.p2,
        scoreP1: match.scoreP1,
        scoreP2: match.scoreP2,
        gameType: match.gameType,
        won: won,
      });
    });
    return ret;
  }

  async createMatchDB(matchInfo: MatchDto) {
    const p1 = await this.findUserByPseudo(matchInfo.p1);
    if (!p1) return;
    const p2 = await this.findUserByPseudo(matchInfo.p2);
    if (!p2) return;
    const p3 = await this.findUserByPseudo(matchInfo.p3);
    const p4 = await this.findUserByPseudo(matchInfo.p4);
    if (p3 || p4) {
      if (!p3 || !p4) return;
      const winner =
        matchInfo.scoreP1 > matchInfo.scoreP2
          ? matchInfo.scoreP1 > matchInfo.scoreP3
            ? matchInfo.scoreP1 > matchInfo.scoreP4
              ? p1
              : p4
            : matchInfo.scoreP3 > matchInfo.scoreP4
              ? p3
              : p4
          : matchInfo.scoreP2 > matchInfo.scoreP3
            ? matchInfo.scoreP2 > matchInfo.scoreP4
              ? p2
              : p4
            : matchInfo.scoreP3 > matchInfo.scoreP4
              ? p3
              : p4;
      let losers;
      if (winner === p1) losers = [p2, p3, p4];
      else if (winner === p2) losers = [p1, p3, p4];
      else if (winner === p3) losers = [p1, p2, p4];
      else losers = [p1, p2, p3];
      const newMatch = this.matchRepository.create({
        ...matchInfo,
        winner: winner,
        loser: losers,
      });
      console.info('createMatchDB', newMatch);
      return await this.matchRepository.save(newMatch);
    } else {
      const winner = matchInfo.scoreP1 > matchInfo.scoreP2 ? p1 : p2;
      const loser: User[] = matchInfo.scoreP1 > matchInfo.scoreP2 ? [p2] : [p1];
      const newMatch = this.matchRepository.create({
        ...matchInfo,
        winner: winner,
        loser: loser,
      });
      console.info('createMatchDB', newMatch);
      return await this.matchRepository.save(newMatch);
    }
  }

  userToDto(user: User): UserDto {
    const newUser: UserDto = {
      username: user.username,
      pseudo: user.pseudo,
      ppImg: user.ppImg,
      status: user.status,
      email: user.email,
      twoFA: user.twoFA,
    };
    return newUser;
  }

  userToLimitedDto(user: User): LimitedUserDto {
    const newUser: LimitedUserDto = {
      pseudo: user.pseudo,
      ppImg: user.ppImg,
      status: user.status,
    };
    return newUser;
  }

  userArraytoLimitedDto(user: User[]): Array<LimitedUserDto> {
    {
      const retDTO: Array<LimitedUserDto> = [];
      for (const friend of user) {
        retDTO.push(this.userToLimitedDto(friend));
      }
      return retDTO;
    }
  }
  async getFriends(id: number): Promise<Array<LimitedUserDto>> {
    const user = await this.findOneUser(
      { id: id },
      ['friends'],
      ['friends', 'id'],
    );
    if (!user) throw new BadRequestException('User Not Found');
    return this.userArraytoLimitedDto(user.friends);
  }

  async getFriendsPending(id: number): Promise<Array<LimitedUserDto>> {
    const user = await this.findOneUser(
      { id: id },
      ['friendsPending'],
      ['friendsPending', 'id'],
    );
    if (!user) throw new BadRequestException('User Not Found');
    return this.userArraytoLimitedDto(user.friendsPending);
  }

  async getFriendsDemands(id: number): Promise<Array<LimitedUserDto>> {
    const user = await this.findOneUser(
      { id: id },
      ['friendsDemands'],
      ['friendsDemands', 'id'],
    );
    if (!user) throw new BadRequestException('User Not Found');
    return this.userArraytoLimitedDto(user.friendsDemands);
  }

  async getBlockList(id: number): Promise<Array<LimitedUserDto>> {
    const user = await this.findOneUser(
      { id: id },
      ['blocked'],
      ['blocked', 'id'],
    );
    if (!user) throw new BadRequestException('User Not Found');
    return this.userArraytoLimitedDto(user.blocked);
  }

  async getBlockByList(id: number): Promise<Array<LimitedUserDto>> {
    const user = await this.findOneUser(
      { id: id },
      ['blockedBy'],
      ['blockedBy', 'id'],
    );
    if (!user) throw new BadRequestException('User Not Found');
    return this.userArraytoLimitedDto(user.blockedBy);
  }

  async findOneUser(
    whereOptions: UserDtoPseudo | { id: number } | UserDtoUsername,
    relationsOptions?: string[],
    selectOptions?: Array<keyof User>,
  ): Promise<User | undefined> {
    let findUserOptions: FindOneOptions<User> = {};
    findUserOptions['where'] = whereOptions;
    findUserOptions['relations'] = relationsOptions;
    findUserOptions['select'] = selectOptions;
    const user = await this.userRepository.findOne(findUserOptions);
    return user;
  }

  private compareUsers(user1: User, user2: User): boolean {
    return user1.id === user2.id;
  }

  private isUserInArray(user: User, array: User[]): boolean {
    for (const elem of array) {
      if (this.compareUsers(elem, user)) return true;
    }
    return false;
  }

  async addFriend(id: number, pseudo: string): Promise<Success> {
    const user = await this.findOneUser(
      { id: id },
      ['friends', 'friendsDemands'],
      ['friends', 'friendsDemands', 'id'],
    );
    if (!user) throw new BadRequestException('User Not Found');
    const friend = await this.findOneUser(
      { pseudo: pseudo },
      ['friends', 'friendsPending'],
      ['friends', 'friendsPending', 'id'],
    );
    if (!friend) throw new BadRequestException('Target Not Found');
    if (friend.id === user.id)
      throw new BadRequestException("You can't add yourself");
    if (!this.isUserInArray(friend, user.friendsDemands))
      throw new BadRequestException(
        "You don't have a friend demand from this user",
      );
    const friends: User[] = user.friends;
    friends.push(friend);
    const inversefriend: User[] = friend.friends;
    inversefriend.push(user);
    const res = await this.userRepository.save(user);
    const res1 = await this.userRepository.save(friend);
    return res && res1 && this.cleanFriends(friend, user)
      ? { success: true }
      : { success: false };
  }

  async declineFriend(id: number, pseudo: string): Promise<Success> {
    const user = await this.findOneUser(
      { id: id },
      ['friendsDemands'],
      ['friendsDemands', 'id'],
    );
    if (!user) throw new BadRequestException('User Not Found');
    const friend = await this.findOneUser(
      { pseudo: pseudo },
      ['friendsPending'],
      ['friendsPending', 'id'],
    );
    if (!friend) throw new BadRequestException('Target Not Found');
    if (!this.isUserInArray(friend, user.friendsDemands))
      throw new BadRequestException(
        "You don't have a friend demand from this user",
      );
    return this.cleanFriends(friend, user);
  }

  async sendFriendDemand(username: string, pseudo: string): Promise<Success> {
    const user = await this.findOneUser(
      { username: username },
      ['friends', 'friendsPending'],
      ['friends', 'friendsPending', 'id'],
    );
    if (!user) throw new BadRequestException('User Not Found');
    const friend = await this.findOneUser(
      { pseudo: pseudo },
      ['friendsDemands'],
      ['friendsDemands', 'id'],
    );
    if (this.isUserInArray(friend, user.friends))
      throw new BadRequestException('Already friends');
    if (!friend) throw new BadRequestException('Target Not Found');
    if (friend.id === user.id)
      throw new BadRequestException("You can't add yourself");
    const friendsPending: User[] = user.friendsPending;
    friendsPending.push(friend);
    const res = await this.userRepository.save(user);
    const friendsDemands: User[] = friend.friendsDemands;
    friendsDemands.push(user);
    const res1 = await this.userRepository.save(friend);
    return res && res1 ? { success: true } : { success: false };
  }

  async deleteFriend(id: number, pseudo: string): Promise<Success> {
    const user = await this.findOneUser(
      { id: id },
      ['friends'],
      ['friends', 'id'],
    );
    if (!user) throw new BadRequestException('User Not Found');
    const friend = await this.findOneUser(
      { pseudo: pseudo },
      ['friends'],
      ['friends', 'id'],
    );
    if (!friend) throw new BadRequestException('Target Not Found');
    if (friend.id === user.id)
      throw new BadRequestException("You can't delete yourself");
    if (!this.isUserInArray(friend, user.friends))
      throw new BadRequestException('This user is not your friend');
    myDebug('deleteFriend', user, friend);
    const friends: User[] = user.friends;
    friends.splice(friends.map((e) => e.id).indexOf(friend.id), 1);
    const res = await this.userRepository.save(user);
    const inversefriend: User[] = friend.friends;
    inversefriend.splice(inversefriend.map((e) => e.id).indexOf(user.id), 1);
    const res1 = await this.userRepository.save(friend);
    return res && res1 ? { success: true } : { success: false };
  }

  private async cleanFriends(pending: User, demand: User): Promise<Success> {
    const indexPending = pending.friendsPending
      .map((e) => e.id)
      .indexOf(demand.id);
    const indexDemand = demand.friendsDemands
      .map((e) => e.id)
      .indexOf(pending.id);
    const friendsPending: User[] = pending.friendsPending;
    friendsPending.splice(indexPending, 1);
    const res = await this.userRepository.save(pending);
    const friendsDemands: User[] = demand.friendsDemands;
    friendsDemands.splice(indexDemand, 1);
    const res1 = await this.userRepository.save(demand);
    return res && res1 ? { success: true } : { success: false };
  }

  async blockUser(username: string, pseudo: string): Promise<Success> {
    const user = await this.findOneUser(
      { username: username },
      ['blocked'],
      ['blocked', 'id'],
    );
    if (!user) throw new BadRequestException('User Not Found');
    const friend = await this.findOneUser(
      { pseudo: pseudo },
      ['blockedBy'],
      ['blockedBy', 'id'],
    );
    if (!friend) throw new BadRequestException('Target Not Found');
    if (friend.id === user.id)
      throw new BadRequestException("You can't block yourself");
    if (this.isUserInArray(friend, user.blocked))
      throw new BadRequestException('This user is already blocked');
    const blocked: User[] = user.blocked;
    blocked.push(friend);
    const res = await this.userRepository.save(user);
    const blockedBy: User[] = friend.blockedBy;
    blockedBy.push(user);
    const res1 = await this.userRepository.save(friend);
    return res && res1 ? { success: true } : { success: false };
  }

  async unblockUser(username: string, pseudo: string): Promise<Success> {
    const user = await this.findOneUser(
      { username: username },
      ['blocked'],
      ['blocked', 'id'],
    );
    if (!user) throw new BadRequestException('User Not Found');
    const friend = await this.findOneUser(
      { pseudo: pseudo },
      ['blockedBy'],
      ['blockedBy', 'id'],
    );
    if (!friend) throw new BadRequestException('Target Not Found');
    if (!this.isUserInArray(friend, user.blocked))
      throw new BadRequestException('This user is not blocked');
    const blocked: User[] = user.blocked;
    blocked.splice(blocked.map((e) => e.id).indexOf(friend.id), 1);
    const res = await this.userRepository.save(user);
    const blockedBy: User[] = friend.blockedBy;
    blockedBy.splice(blockedBy.map((e) => e.id).indexOf(user.id), 1);
    const res1 = await this.userRepository.save(friend);
    return res && res1 ? { success: true } : { success: false };
  }

  async getBlockedBy(username: string): Promise<Array<string>> {
    const user = await this.findOneUser(
      { username: username },
      ['blockedBy'],
      ['blockedBy', 'id'],
    );
    if (!user) throw new BadRequestException('User Not Found');
    const blockedBy = user.blockedBy.map((e) => {
      return e.username;
    });
    return blockedBy;
  }
}
