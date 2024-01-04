import { IsBoolean, IsEnum, IsNumber, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import { Status } from "./types";
import { IntersectionType, PickType } from "@nestjs/mapped-types";

export class UserDto {
	@IsString()
	username: string;

	@IsString()
	pseudo: string;

	@IsString()
	ppImg: string;

	@IsEnum(Status)
	status: Status;

	@IsPhoneNumber()
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



export class MatchDto {
	@IsNumber()
	scoreP1: number;

	@IsNumber()
	scoreP2: number;

	@IsString()
	P1: string;

	@IsString()
	P2: string;
}