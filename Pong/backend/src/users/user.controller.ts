import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  UserDto,
  UserDtoEmail,
  UserDtoPPImg,
  UserDtoPassword,
  UserDtoPseudo,
  UserDtoStatus,
  UserDtoTwoFA
} from 'shared/src/Dtos';
import { Success } from 'shared/src/types';
import { myDebug } from 'src/utils/DEBUG';
import { FileSizeGuard } from './fileSize.guard';
import { editFileName, imageFileFilter } from './multerOptions';
import { UsersService } from './users.service';

@Controller({ path: 'me' })
export class UserController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUser(@Req() req: any): Promise<UserDto | HttpException> {
    myDebug('getUser', req.user);
    const user = await this.userService.findUserById(req.user.userId);
    if (!user) return new BadRequestException('User Not Found');
    return this.userService.userToDto(user);
  }

  @Put('/email')
  async UpdateUserEmail(@Body() body: UserDtoEmail, @Req() req: any) : Promise<Success | HttpException> {
    myDebug('UpdateUserEmail', req.user, body);
    const res = await this.userService.updateUserById(req.user.userId, body);
    if (res.affected) return { success: true };
    return { success: false };
  }

  @Put('/twoFA')
  async UpdateUserTwoFa(@Body() body: UserDtoTwoFA, @Req() req: any): Promise<Success | HttpException> {
    myDebug('UpdateUserTwoFa', req.user, body);
    const res = await this.userService.updateUserById(req.user.userId, body);
    if (res.affected) return { success: true };
    return { success: false };
  }

  @Put('/pseudo')
  async UpdateUserPseudo(@Body() body: UserDtoPseudo, @Req() req: any): Promise<Success | HttpException> {
    myDebug('UpdateUserPseudo', req.user, body);
    const res = await this.userService.updateUserById(req.user.userId, body);
    if (res.affected) return { success: true };
    return { success: false };
  }

  @Put('/password')
  async UpdateUserPassword(@Body() body: UserDtoPassword, @Req() req: any): Promise<Success | HttpException> {
    myDebug('UpdateUserPassword', req.user, body);
    const res = await this.userService.updateUserById(req.user.userId, body);
    if (res.affected) return { success: true };
    return { success: false };
  }

  @Put('ppImg')
  async UpdateUserPPImg(@Body() body: UserDtoPPImg, @Req() req: any): Promise<Success | HttpException> {
    myDebug('UpdateUserPPImg', req.user, body);
    const res = await this.userService.updateUserById(req.user.userId, body);
    if (res.affected) return { success: true };
    return { success: false };
  }

  @UseGuards(FileSizeGuard)
	@UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
      )
	@Post('/uploadAvatar')
  async uploadedFile(@Req() req: any, @UploadedFile() file) {
    await this.userService.updateUserById(req.user.userId, {ppImg: file.filename});
    return {src: file.filename};
    }

  
  @Put('/status')
  async UpdateUserStatus(@Body() body: UserDtoStatus, @Req() req: any): Promise<Success | HttpException> {
    myDebug('UpdateUserStatus', req.user, body);
    const res = await this.userService.updateUserById(req.user.userId, body);
    if (res.affected) return { success: true };
    return { success: false };
  }
}
