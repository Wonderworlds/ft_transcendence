import { SetMetadata } from '@nestjs/common';
import { User } from 'src/typeorm/entities/User';

export const IS_PUBLIC_KEY = 'isPublic';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

export type JWTPayload = {sub: number, user: User};
