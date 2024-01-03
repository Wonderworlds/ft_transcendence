import { IsEnum, IsNumber, IsString, IsStrongPassword } from "class-validator";
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
}

export class SecurePasswordDto {
	@IsString()
	@IsStrongPassword()
	password: string;
}

export class UpdateUserDtoPseudo extends PickType(UserDto, ['pseudo'] as const) {}
export class UpdateUserDtoPPImg extends PickType(UserDto, ['ppImg'] as const) {}
export class UpdateUserDtoStatus extends PickType(UserDto, ['status'] as const) {}
export class UserDtoUsername extends PickType(UserDto, ['username'] as const) {}

export class SecureUserDto extends IntersectionType(UserDto, SecurePasswordDto) {}
export class LogInUserDto extends IntersectionType(UserDtoUsername, SecurePasswordDto) {}



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