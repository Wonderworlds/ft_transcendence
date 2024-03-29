import { IntersectionType, PickType } from '@nestjs/mapped-types';
import {
  IsAlphanumeric,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length
} from 'class-validator';
import { EventGame, GameType, Pos, Status } from './types';


export enum GameState {
  INIT = 'init',
  START = 'waiting',
  PLAYING = 'playing',
  PAUSE = 'pause',
  GAMEOVER = 'gameover',
  AUTODESTRUCT = 'autodestruct',
}

export type LobbyDto = {
  id: string;
  owner: string;
  gameType: GameType;
  nbPlayers: number;
  maxPlayers: number;
  status: GameState;
};

export class AuthDto {
  @IsString()
  access_token: string;
  @IsString()
  username: string;
  @IsBoolean()
  twoFA: boolean;
}

export class TwoFADto {
  @IsString()
  code: string;
}

export class UserDto {
  @Length(3, 12)
  @IsAlphanumeric()
  username: string;

  @Length(3, 12)
  @IsAlphanumeric()
  pseudo: string;

  @IsString()
  ppImg: string;

  @IsEnum(Status)
  status: Status;

  @IsEmail()
  email?: string;

  @IsBoolean()
  twoFA?: boolean;
}

export class UserDtoPassword {
  @IsString()
  @IsStrongPassword()
  password: string;
}

export class LimitedUserDto extends PickType(UserDto, [
  'pseudo',
  'ppImg',
  'status',
] as const) {}
export class UserDtoPseudo extends PickType(UserDto, ['pseudo'] as const) {}
export class UserDtoPPImg extends PickType(UserDto, ['ppImg'] as const) {}
export class UserDtoStatus extends PickType(UserDto, ['status'] as const) {}
export class UserDtoTwoFA extends PickType(UserDto, ['twoFA'] as const) {}
export class UserDtoEmail extends PickType(UserDto, ['email'] as const) {}
export class UserDtoUsername extends PickType(UserDto, ['username'] as const) {}

export class LogInUserDto extends IntersectionType(
  UserDtoUsername,
  UserDtoPassword,
) {}
export class SecureUserDto extends IntersectionType(UserDto, UserDtoPassword) {}

export class CodeDto {
  @IsString()
  password: string;
}

export class CreateLobbyDto {
  @IsEnum(GameType)
  gameType: GameType;
  @IsBoolean()
  isLocal: boolean;
}

export class CreateCustomLobbyDto {
  @IsString()
  owner: string;
  @IsString()
  friend: string;
}
export class MatchDto {
  @IsNumber()
  scoreP1: number;
  
  @IsNumber()
  scoreP2: number;

  @IsOptional()
  @IsNumber()
  scoreP3?: number;

  @IsOptional()
  @IsNumber()
  scoreP4?: number;
  
  
  @IsOptional()
  @IsDate()
  date?: Date;

  @IsString()
  winnerPseudo?: string;

  @IsString()
  p1: string;

  @IsString()
  p2: string;

  @IsOptional()
  @IsString()
  p3?: string;
  
  @IsOptional()
  @IsString()
  p4?: string;

  @IsEnum(GameType)
  gameType: GameType;

  @IsString()
  @IsOptional()
  winner?: string;

  @IsBoolean()
  @IsOptional()
  won?: boolean;
}

export class LobbyIDDto {
  @IsString()
  lobby: string;
}

export class AcceptDto {
  @IsBoolean()
  accept: boolean;
}

export class InputDto {
  @IsEnum(EventGame)
  input: EventGame;
}


export class InputsDto {
  @IsEnum(EventGame, {each: true})
  inputs: EventGame[];
}

enum InputMove {
  UP = EventGame.UP,
  DOWN = EventGame.DOWN,
  LEFT = EventGame.LEFT,
  RIGHT = EventGame.RIGHT,
}
export class InputCLIDto {
  @IsEnum(InputMove)
  input: InputMove;
}

export class messageLobbyDto {
  @IsString()
  message: string;
  @IsString()
  lobby: string;
}

export class privateMessageLobbyDto {
  @IsString()
  message: string;
  @IsString()
  lobby: string;
  @IsString()
  to: string;
}

export class PseudoLobbyDto extends IntersectionType(
  LobbyIDDto,
  UserDtoPseudo,
) {}
export class InputLobbyDto extends IntersectionType(InputDto, PseudoLobbyDto) {}
export class InputsLobbyDto extends IntersectionType(InputsDto, PseudoLobbyDto) {}
export class UserLobbyDto extends IntersectionType(
  LobbyIDDto,
  LimitedUserDto,
) {}
export class AcceptLobbyDto extends IntersectionType(LobbyIDDto, AcceptDto) {}
export class UpdateGameDto {
  ball: Pos;
  pLeft: Pos;
  pRight: Pos;
  scorePLeft: number;
  scorePRight: number;
  pTop?: Pos;
  pBot?: Pos;
  scorePTop?: number;
  scorePBot?: number;
}

export class clientMessageLobbyDto {
  message: string;
  from: LimitedUserDto;
  isPrivate: boolean;
}
