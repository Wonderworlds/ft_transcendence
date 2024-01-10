import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { myDebug } from 'src/utils/DEBUG';
import { UserDto, UserDtoEmail, UserDtoPPImg, UserDtoPassword, UserDtoPseudo, UserDtoStatus, UserDtoTwoFA } from 'src/utils/Dtos';
import { Success } from 'src/utils/types';
import { FileSizeGuard } from './fileSize.guard';
import { editFileName, imageFileFilter } from './multerOptions';
import { UsersService } from './users.service';

@Controller({ path: 'me' })
export class UserController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUser(@Req() req: any): Promise<UserDto | HttpException> {
    return this.userService.getMe(req.user.userId);
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
    body.pseudo = body.pseudo.toLowerCase();
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
    const fileNamePath = `${process.env.VITE_BURL}/public/${file.filename}`;
    await this.userService.updateUserById(req.user.userId, {ppImg: fileNamePath});
    return {src: fileNamePath};
    }

  
  @Put('/status')
  async UpdateUserStatus(@Body() body: UserDtoStatus, @Req() req: any): Promise<Success | HttpException> {
    myDebug('UpdateUserStatus', req.user, body);
    const res = await this.userService.updateUserById(req.user.userId, body);
    if (res.affected) return { success: true };
    return { success: false };
  }

  @Get('/friends')
  async getFriends(@Req() req: any) {
    myDebug('getFriends', req.user);
    return await this.userService.getFriends(req.user.userId);
  }
  
  @Get('/friends/pending')
  async getFriendsPending(@Req() req: any) {
    myDebug('getFriendsPending', req.user);
    return await this.userService.getFriendsPending(req.user.userId);
  }

  
  @Get('/friends/demands')
  async getFriendsDemands(@Req() req: any) {
    myDebug('getFriendsDemands', req.user);
    return await this.userService.getFriendsDemands(req.user.userId);
  }

  @Post('/friends/:pseudo/accept') // final step Add friends
  async addFriend(@Req() req: any, @Param() params: UserDtoPseudo) {
    myDebug('addFriend', req.user, params);
    return await this.userService.addFriend(req.user.userId, params.pseudo);
  }
  
  @Post('/friends/:pseudo/decline') // final step Add friends
  async declineFriend(@Req() req: any, @Param() params: UserDtoPseudo) {
    myDebug('declineFriend', req.user, params);
    return await this.userService.declineFriend(req.user.userId, params.pseudo);
  }
  
  @Post('/friends/:pseudo') // friend demand
  async sendFriendDemand(@Req() req: any, @Param() params: UserDtoPseudo) {
    myDebug('sendFriendDemand', req.user, params);
    return await this.userService.sendFriendDemand(req.user.userId, params.pseudo);
  }
  
  @Delete('/friends/:pseudo')
  async deleteFriend(@Req() req: any, @Param() params: UserDtoPseudo) {
    myDebug('deleteFriend', req.user, params);
    return await this.userService.deleteFriend(req.user.userId, params.pseudo);
  }

  @Post('/block/:pseudo')
  async blockUser(@Req() req: any, @Param() params: UserDtoPseudo) {
    myDebug('blockUser', req.user, params);
    return await this.userService.blockUser(req.user.userId, params.pseudo);
  }

  @Delete('/block/:pseudo')
  async unblockUser(@Req() req: any, @Param() params: UserDtoPseudo) {
    myDebug('unblockUser', req.user, params);
    return await this.userService.unblockUser(req.user.userId, params.pseudo);
  }

  @Get('/block')
  async getBlockList(@Req() req: any) {
    myDebug('getBlockList', req.user);
    return await this.userService.getBlockList(req.user.userId);
  }

  @Get('matchs')
  async getMatchHistory(@Req() req: any) {
    myDebug('getMatchHistory', req.user);
    const user = await this.userService.findUserById(req.user.userId);
    if (!user) throw new BadRequestException('User Not Found');
    return await this.userService.getMatchHistory(user);
  }
}


