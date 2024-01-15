import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SkipAuth } from 'src/auth/utils';
import { GameState } from 'src/utils/Dtos';
import { InputCLIDto } from './../utils/Dtos';
import { PongService } from './pong.service';

@SkipAuth()
@Controller('pong')
export class PongController {
  constructor(public pongService: PongService) {}

  @Get('ping')
  ping() {
    return 'pong';
  }

  @Get('lobbys')
  onGetLobbys() {
    return this.pongService.getLobbysAll();
  }

  @Get('lobby/:id')
  onGetLobbyID(@Param('id') id: string) {
    const lobby = this.pongService.getLobbyID(id);
    if (!lobby) return { error: 'Lobby not found', status: 404 };
    return lobby.getUpdateLobbyDto();
  }

  @Get('lobby/:id/game')
  onGetLobbyPong(@Param('id') id: string) {
    const lobby = this.pongService.getLobbyID(id);
    if (!lobby) return { error: 'Lobby not found', status: 404 };
    if (lobby.status !== GameState.PLAYING)
      return {
        error: 'Pong not started',
        lastMatch: { ...lobby.getMatchLog() },
      };
    return lobby.getGameUpdate();
  }

  @Get('lobby/:id/logs')
  onGetLobbyLogs(@Param('id') id: string) {
    const lobby = this.pongService.getLobbyID(id);
    if (!lobby) return { error: 'Lobby not found', status: 404 };
    return { lastMatch: { ...lobby.getMatchLog() } };
  }

  @Post('lobby/:id/game/:pseudo/move')
  onMovePlayer(
    @Param('id') id: string,
    @Param('pseudo') pseudo: string,
    @Body() body: InputCLIDto,
  ) {
    return this.pongService.movePaddleCli(id, pseudo, body.input);
  }

  @Post('lobby/:id/game/:pseudo/start')
  onStartGame(@Param('id') id: string, @Param('pseudo') pseudo: string) {
    return this.pongService.startCLI(id, pseudo);
  }

  @Post('lobby/:id/game/rematch')
  onRematch(@Param('id') id: string) {
    return this.pongService.reMatchCLI(id);
  }

  @Post('lobby/:id/game/:pseudo/pause')
  onPause(@Param('id') id: string, @Param('pseudo') pseudo: string) {
    return this.pongService.pauseCli(id, pseudo);
  }

  @Post('lobby/:id/game/:pseudo/unpause')
  onUnpause(@Param('id') id: string, @Param('pseudo') pseudo: string) {
    return this.pongService.unpauseCli(id, pseudo);
  }

  @Get('lobby/:id/game/ready')
  onGetReady(@Param('id') id: string) {
    return this.pongService.getPlayerReady(id);
  }
}
