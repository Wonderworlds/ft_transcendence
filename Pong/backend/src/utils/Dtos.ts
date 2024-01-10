import { IntersectionType, PickType } from "@nestjs/mapped-types";
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsString, IsStrongPassword, Length } from "class-validator";
import { EventGame, GameType, Pos, Status } from "./types";


export type LobbyDto = {
	id: string;
	owner: string;
	gameType: GameType;
	nbPlayers: number;
	maxPlayers: number;
	status: 'waiting' | 'playing';
};

export class AuthDto  {
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
	@IsString()
	username: string;

	@Length(3, 20)
	@IsString()
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

export class LimitedUserDto extends PickType(UserDto, ['pseudo', 'ppImg', 'status'] as const) {}
export class UserDtoPseudo extends PickType(UserDto, ['pseudo'] as const) {}
export class UserDtoPPImg extends PickType(UserDto, ['ppImg'] as const) {}
export class UserDtoStatus extends PickType(UserDto, ['status'] as const) {}
export class UserDtoTwoFA extends PickType(UserDto, ['twoFA'] as const) {}
export class UserDtoEmail extends PickType(UserDto, ['email'] as const) {}
export class UserDtoUsername extends PickType(UserDto, ['username'] as const) {}

export class LogInUserDto extends IntersectionType(UserDtoUsername, UserDtoPassword) {}
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
export class MatchDto {
	@IsNumber()
	scoreP1: number;

	@IsNumber()
	scoreP2: number;

	@IsString()
	P1: string;

	@IsString()
	P2: string;

	@IsBoolean()
	won: boolean;

	@IsEnum(GameType)
	gameType: GameType;

}

export class lobbyIDDto {
	@IsString()
	lobby: string;
}

export class inputDto {
	@IsEnum(EventGame)
	input: EventGame;
}

export class inputLobbyDto extends IntersectionType(lobbyIDDto, inputDto) {};

export class UpdateGameDto {
  ball: Pos;
  pLeft: Pos;
  pRight: Pos;
  scorePLeft: number;
  scorePRight: number;
};