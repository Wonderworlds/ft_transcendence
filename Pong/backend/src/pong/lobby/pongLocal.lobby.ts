import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { Tournament } from 'src/utils/Tournament';
import {
  ChatMessageType,
  EventGame,
  GameType,
  ValidSocket
} from 'src/utils/types';
import { GameState, LimitedUserDto, MatchDto } from '../../utils/Dtos';
import { Pong } from '../Pong';
import { Pong4p } from '../Pong4p';
import { PongLobby } from './pong.lobby';

export type UpdateLobbyDto = {
  nbPlayer: number;
  maxClients?: number;
  pLeftReady: boolean;
  pRightReady: boolean;
  pTopReady?: boolean;
  pBotReady?: boolean;
  gameState: GameState;
  pLeft: LimitedUserDto;
  pRight: LimitedUserDto;
  pTop?: LimitedUserDto;
  pBot?: LimitedUserDto;
};

export class PongLobbyLocal extends PongLobby {
  @WebSocketServer()
  server: Server;
  private ownerIsIn: boolean = false;
  constructor(
    id: string,
    server: Server,
    owner: ValidSocket,
    gameType: GameType,
    protected readonly userService: UsersService,
    destroy: (lobby: string) => void,
  ) {
    super(id, server, owner, gameType, userService, destroy);
  }

  override async addClient(
    @ConnectedSocket() client: ValidSocket,
    user: LimitedUserDto,
  ) {
    const oldClient = this.listClients.get(user.pseudo);
    if (oldClient && user.pseudo !== this.OwnerUser.pseudo) return;
    if (oldClient) return this.updateClient(client, oldClient, user);
    if (this.listClients.size >= this.maxClients) return;
    if (this.listClients.size === 0) {
      this.ownerIsIn = true;
      this.OwnerUser = user;
      client.join(this.id);
    }
    this.listClients.set(user.pseudo, client);
    this.userMap.set(user.pseudo, user);
    console.info('addClientLocal', user);
    if (this.isClassic && this.listClients.size === 2) {
      this.pLeft = this.OwnerUser;
      this.pRight = user;
      this.initMatch(this.pLeft, this.pRight);
      return;
    } else if (this.isMultiplayer && this.listClients.size === 4) {
      const iterator = this.userMap.entries();
      this.pLeft = iterator.next().value[1];
      this.pRight = iterator.next().value[1];
      this.pTop = iterator.next().value[1];
      this.pBot = iterator.next().value[1];
      console.info('initMatch', this.pLeft, this.pRight, this.pTop, this.pBot);
      this.initMatch4p(this.pLeft, this.pRight, this.pTop, this.pBot);
      return;
    } else if (this.isTournament && this.listClients.size >= 4) {
      if (this.listClients.size === 16) return this.initTournament();
      console.info('addClientLocal', 'tournamentIsReady');
      this.server.to(this.id).emit('tournamentIsReady');
    }
    console.info(
      'addClientLocal',
      this.isClassic,
      this.isMultiplayer,
      this.isTournament,
    );
    this.serverUpdateClients();
  }

  override updateClient(
    @ConnectedSocket() client: ValidSocket,
    oldClient: ValidSocket,
    user: LimitedUserDto,
  ) {
    this.ownerIsIn = true;
    let timeout = this.mapTimeout.get(client.name);
    console.info('setCB ', timeout);
    clearTimeout(timeout);
    this.mapTimeout.delete(client.name);
    timeout = null;
    if (oldClient.id !== client.id) {
      oldClient.leave(this.id);
      this.OwnerUser === user;
      this.owner = client;
      this.listClients.set(user.pseudo, client);
    }
    client.join(this.id);
    this.pongInstanceUnpause(this.OwnerUser.pseudo);
    this.serverUpdateClients();
    console.info('updateClientLocal', client.id, oldClient.id);
    this.updateMsg(client);
  }

  override removeClient(@ConnectedSocket() client: ValidSocket) {
    console.info('removeClientLocal', client.name);
    this.ownerIsIn = false;
    client.leave(this.id);
    this.pongInstancePause(this.OwnerUser.pseudo);
  }

  override initTournament() {
    if (this.status !== GameState.INIT) return;
    this.server.to(this.id).emit('messageLobby', {
      message: 'tournament is starting',
      type: ChatMessageType.BOT,
    });
    this.winners = [];
    this.tournament = new Tournament(this.shuffle(this.getPlayers()));
    this.status = GameState.START;
    if (!this.launchMatchTournament()) {
      console.info('initTournament', 'tournament Error');
      this.forcedLeave();
    }
    this.serverUpdateClients();
  }

  override nextMatch() {
    if (this.status !== GameState.GAMEOVER) return;
    this.status = GameState.INIT;
    this.pongInstance = null;
    if (this.isClassic) this.initMatch(this.pLeft, this.pRight);
    else if (this.isMultiplayer) {
      console.info('nextMatch', this.pLeft, this.pRight, this.pTop, this.pBot);
      this.initMatch4p(this.pLeft, this.pRight, this.pTop, this.pBot);
    } else if (this.isTournament) {
      this.status = GameState.INIT;
      this.initTournament();
    }
  }

  initMatch4p(
    pleft: LimitedUserDto,
    pright: LimitedUserDto,
    ptop: LimitedUserDto,
    pbot: LimitedUserDto,
  ) {
    if (this.status !== GameState.INIT) return;
    this.pongInstance = new Pong4p(
      this,
      this.id,
      this.server,
      pleft.pseudo,
      pright.pseudo,
      ptop.pseudo,
      pbot.pseudo,
    );
    this.status = GameState.START;
    this.serverUpdateClients();
    console.info('initMatchLocal', 'playerReady');
    this.server.to(this.id).emit('isPlayerReady');
    this.server.to(this.id).emit('messageLobby', {
      message: 'match is starting',
      type: ChatMessageType.BOT,
    });
    this.server.to(this.id).emit('messageLobby', {
      message: 'pleft: ' + pleft.pseudo,
      type: ChatMessageType.BOT,
    });
    this.server.to(this.id).emit('messageLobby', {
      message: 'pright: ' + pright.pseudo,
      type: ChatMessageType.BOT,
    });
    this.server.to(this.id).emit('messageLobby', {
      message: 'ptop: ' + ptop.pseudo,
      type: ChatMessageType.BOT,
    });
    this.server.to(this.id).emit('messageLobby', {
      message: 'pbot: ' + pbot.pseudo,
      type: ChatMessageType.BOT,
    });
  }

  initMatch(pleft: LimitedUserDto, pright: LimitedUserDto) {
    if (this.status !== GameState.INIT) return;
    this.pongInstance = new Pong(
      this,
      this.id,
      this.server,
      pleft.pseudo,
      pright.pseudo,
    );
    this.status = GameState.START;
    this.server.to(this.id).emit('messageLobby', {
      message:
        'Game is starting: ' + this.pLeft.pseudo + ' vs ' + this.pRight.pseudo,
      type: ChatMessageType.BOT,
    });
    console.info('initMatchLocal', 'playerReady');
    console.info('initMatchLocal', this.pongInstance.getPlayersReady());
    console.info('startMatch', this.isTournament, this.pLeft, this.pRight);
    this.serverUpdateClients();
    this.server.to(this.id).emit('isPlayerReady');
  }

  startMatch(pseudo: string) {
    console.info('startMatch', this.isTournament, this.pLeft, this.pRight);
    if (this.isClassic || this.isTournament) {
      console.info('startMatch', this.pongInstance.getPlayersReady());
      if (this.status !== GameState.START || !this.pongInstance) return;
      if (this.pongInstance.startMatch(this.pLeft.pseudo))
        this.status = GameState.PLAYING;
      if (this.pongInstance.startMatch(this.pRight.pseudo))
        this.status = GameState.PLAYING;
      console.info('startMatch', this.pongInstance.getPlayersReady());
    } else if (this.isMultiplayer) {
      console.info('startMatch', this.pongInstance.getPlayersReady());
      if (this.status !== GameState.START || !this.pongInstance) return;
      if (this.pongInstance.startMatch(this.pLeft.pseudo))
        this.status = GameState.PLAYING;
      if (this.pongInstance.startMatch(this.pRight.pseudo))
        this.status = GameState.PLAYING;
      if (this.pongInstance.startMatch(this.pTop.pseudo))
        this.status = GameState.PLAYING;
      if (this.pongInstance.startMatch(this.pBot.pseudo))
        this.status = GameState.PLAYING;
      console.info('startMatch', this.pongInstance.getPlayersReady());
    }
    this.serverUpdateClients();
  }

  public override pongInstanceEnd(log: any) {
    const matchLog: MatchDto = {
      gameType: this.gameType,
      ...log,
    };
    console.info('game over', matchLog, this.id);
    this.status = GameState.GAMEOVER;
    const winner =
      matchLog.scoreP1 > matchLog.scoreP2 ? matchLog.p1 : matchLog.p2;
    this.server.to(this.id).emit('messageLobby', {
      message: 'Match is over: winner ' + winner,
      type: ChatMessageType.BOT,
    });
    if (this.isTournament) {
      this.winners.push(winner);
      console.info('winners', this.winners);
      const res = this.launchMatchTournament();
      if (!res && this.winners.length === 1) {
        console.info('tournament over', this.winners);
        this.server.to(this.id).emit('messageLobby', {
          message: 'Tournament is over: winner ' + winner,
          type: ChatMessageType.BOT,
        });
        this.server.to(this.id).emit('gameOver', matchLog);
      } else if (!res) {
        this.tournament.setNextRoundPlayers(this.winners);
        this.winners = [];
        this.launchMatchTournament();
      }
      return ;
    }
    this.server.to(this.id).emit('gameOver', matchLog);
    this.serverUpdateClients();
  }

  public getOwnerPseudo() {
    return this.OwnerUser.pseudo;
  }

  private inputGameLocal(
    input: EventGame.UP | EventGame.DOWN,
    pseudo: string,
    p1: boolean,
  ) {
    if (this.status !== GameState.PLAYING || !this.pongInstance) return;
    p1
      ? this.pongInstance.onInput(input, this.pLeft.pseudo)
      : this.pongInstance.onInput(input, this.pRight.pseudo);
  }

  private inputGameLocal4P(
    input: EventGame.LEFT | EventGame.RIGHT,
    pseudo: string,
    p3: boolean,
  ) {
    if (this.status !== GameState.PLAYING || !this.pongInstance) return;
    const pongInstance4p = this.pongInstance as Pong4p;
    p3
      ? pongInstance4p.onInput(input, this.pTop.pseudo)
      : pongInstance4p.onInput(input, this.pBot.pseudo);
  }

  override onInput(
    @ConnectedSocket() client: ValidSocket,
    input: EventGame,
    pseudo: string,
  ) {
    switch (input) {
      case EventGame.ARROW_UP:
        return this.inputGameLocal(EventGame.UP, pseudo, false);
      case EventGame.ARROW_DOWN:
        return this.inputGameLocal(EventGame.DOWN, pseudo, false);
      case EventGame.W_KEY:
        return this.inputGameLocal(EventGame.UP, pseudo, true);
      case EventGame.S_KEY:
        return this.inputGameLocal(EventGame.DOWN, pseudo, true);
      case EventGame.ARROW_LEFT:
        return this.inputGameLocal4P(EventGame.LEFT, pseudo, false);
      case EventGame.ARROW_RIGHT:
        return this.inputGameLocal4P(EventGame.RIGHT, pseudo, false);
      case EventGame.A_KEY:
        return this.inputGameLocal4P(EventGame.LEFT, pseudo, true);
      case EventGame.D_KEY:
        return this.inputGameLocal4P(EventGame.RIGHT, pseudo, true);
      case EventGame.START_MATCH:
        return this.startMatch(pseudo);
      case EventGame.START_TOURNAMENT:
        return this.initTournament();
      case EventGame.PAUSE:
        return this.pongInstancePause(pseudo);
      case EventGame.NEXT:
        return this.nextMatch();
    }
  }

  public isOwnerConnected(): boolean {
    return this.ownerIsIn;
  }

  public isPseudoTaken(pseudo: string): boolean {
    return this.listClients.has(pseudo);
  }
}
