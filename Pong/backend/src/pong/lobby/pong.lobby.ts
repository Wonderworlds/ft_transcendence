import { Inject } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { GameState, LimitedUserDto, MatchDto } from 'src/utils/Dtos';
import { Tournament } from 'src/utils/Tournament';
import {
  ChatMessageType,
  EventGame,
  GameType,
  ValidSocket,
} from 'src/utils/types';
import { Pong } from '../Pong';
import { Pong4p } from '../Pong4p';
import { UpdateLobbyDto } from './pongLocal.lobby';

export class PongLobby {
  //#region VariablesRegion
  public server: Server;
  public listClients = new Map<string, ValidSocket>();
  protected mapTimeout = new Map<string, NodeJS.Timeout>();
  protected userMap = new Map<string, LimitedUserDto>();
  public maxClients = 24;
  public gameType: GameType;
  public status: GameState = GameState.INIT;
  protected owner: ValidSocket;
  protected pLeft: LimitedUserDto = null;
  protected pRight: LimitedUserDto = null;
  protected pBot: LimitedUserDto = null;
  protected pTop: LimitedUserDto = null;
  private playerSocketsID: string[] = [];
  private nextPlayers: string[] = null;
  public id: string;
  protected pongInstance: Pong | Pong4p;
  protected OwnerUser: LimitedUserDto;
  protected isClassic: boolean = false;
  protected isMultiplayer: boolean = false;
  protected isTournament: boolean = false;
  protected winners: string[] = [];
  private away: Map<string, LimitedUserDto> = new Map<string, LimitedUserDto>();
  @Inject()
  protected tournament: Tournament;
  private matchlog: MatchDto = null;
  private readonly destroyLobby: (id: string) => void;
  //#endregion

  constructor(
    id: string,
    server: Server,
    owner: ValidSocket,
    gameType: GameType,
    protected readonly userService: UsersService,
    destroyLobby: (id: string) => void,
  ) {
    this.id = id;
    this.server = server;
    this.owner = owner;
    this.gameType = gameType;
    this.destroyLobby = destroyLobby;
    if (
      gameType === GameType.classicOnline ||
      gameType === GameType.classicLocal
    ) {
      this.maxClients = 2;
      this.isClassic = true;
    } else if (
      gameType === GameType.multiplayerOnline ||
      gameType === GameType.multiplayerLocal
    ) {
      this.isMultiplayer = true;
      this.maxClients = 4;
    } else if (
      gameType === GameType.tournamentLocal ||
      gameType === GameType.tournamentOnline
    ) {
      this.isTournament = true;
      this.maxClients = 16;
    }
    setTimeout(() => {
      if (this.listClients.size === 0) {
        this.status = GameState.AUTODESTRUCT;
        this.destroyLobby(this.id);
      }
    }, 1000 * 5);
  }

  //#region ConnectionRegion

  async addClient(
    @ConnectedSocket() client: ValidSocket,
    user: LimitedUserDto,
  ) {
    client.join(this.id);
    client.lobby = this.id;
    const oldClient = this.listClients.get(client.name);
    if (oldClient) return this.updateClient(client, oldClient, user);
    if (this.listClients.size === 0) {
      this.owner = client;
      this.OwnerUser = user;
    }
    this.listClients.set(client.name, client);
    this.userMap.set(client.name, user);
    console.info('addClient', client.id);
    if (
      this.isClassic &&
      this.listClients.size >= 2 &&
      this.mapTimeout.size === 0
    ) {
      return this.initMatchStart();
    } else if (
      this.isMultiplayer &&
      this.listClients.size >= 4 &&
      this.mapTimeout.size === 0
    ) {
      return this.initMatchStart();
    } else if (
      this.isTournament &&
      this.listClients.size >= 4 &&
      this.mapTimeout.size === 0
    ) {
      if (this.listClients.size === 16) return this.initTournament();
      console.info('addClient', 'tournamentIsReady');
      this.server.to(this.owner.id).emit('tournamentIsReady');
    }
    this.serverUpdateClients();
  }

  protected updateClient(
    @ConnectedSocket() client: ValidSocket,
    oldClient: ValidSocket,
    user: LimitedUserDto,
  ) {
    let timeout = this.mapTimeout.get(client.name);
    timeout && this.mapTimeout.delete(client.name) && clearTimeout(timeout);
    timeout = null;
    const oldPseudo = this.userMap.get(oldClient.name).pseudo;
    if (oldClient.id === client.id) {
      this.userMap.set(client.name, user);
    } else {
      oldClient.leave(this.id);
      if (this.owner.name === oldClient.name) this.owner = client;
      this.listClients.set(client.name, client);
      this.userMap.set(client.name, user);
    }
    if (this.away.delete(client.name)) {
      this.server.to(this.id).emit('messageLobby', {
        message:
          user.pseudo +
          ' is back, this lobby is saved and will not selfdestruct after the game is over',
        type: ChatMessageType.SERVER,
      });
    }
    if (this.pLeft && this.pLeft.pseudo === oldPseudo) {
      this.pLeft = user;
      this.playerSocketsID[0] = client.id;
      this.pongInstance?.setPlayersName(user.pseudo, null);
    }
    if (this.pRight && this.pRight.pseudo === oldPseudo) {
      this.pRight = user;
      this.playerSocketsID[1] = client.id;
      this.pongInstance?.setPlayersName(null, user.pseudo);
    }
    if (this.pTop && this.pTop.pseudo === oldPseudo) {
      this.pTop = user;
      this.playerSocketsID[2] = client.id;
      this.pongInstance?.setPlayersName(null, null, user.pseudo, null);
    }
    if (this.pBot && this.pBot.pseudo === oldPseudo) {
      this.pBot = user;
      this.playerSocketsID[3] = client.id;
      this.pongInstance?.setPlayersName(null, null, null, user.pseudo);
    }
    if (
      this.isClassic &&
      this.status === GameState.INIT &&
      this.listClients.size >= 2 &&
      this.mapTimeout.size === 0
    ) {
      return this.initMatchStart();
    } else if (
      this.isMultiplayer &&
      this.status === GameState.INIT &&
      this.listClients.size >= 4 &&
      this.mapTimeout.size === 0
    ) {
      return this.initMatchStart();
    } else if (
      this.isTournament &&
      this.status === GameState.INIT &&
      this.listClients.size >= 4 &&
      this.mapTimeout.size === 0
    ) {
      if (this.listClients.size === 16) return this.initTournament();
      console.info('addClient', 'tournamentIsReady');
      this.server.to(this.owner.id).emit('tournamentIsReady');
    }
    if (this.status === GameState.PAUSE) {
      this.pongInstanceUnpause(user.pseudo);
    }
    console.info('updateClient', client.id, oldClient.id);
    this.updateMsg(client);
    this.serverUpdateClients();
  }

  protected updateMsg(@ConnectedSocket() client: ValidSocket) {
    const user = this.userMap.get(client.name);
    if (
      this.status === GameState.INIT &&
      this.isTournament &&
      this.owner.id === client.id &&
      this.listClients.size >= 4
    ) {
      console.info('updateClientLocal', 'tournamentIsReady');
      this.server.to(client.id).emit('tournamentIsReady');
    }
    if (this.status === GameState.START) {
      console.info('updateClientLocal', 'GameState.START');
      if (
        user === this.pLeft ||
        user === this.pRight ||
        user === this.pTop ||
        user === this.pBot
      )
        this.server.to(client.id).emit('isPlayerReady');
      this.server.to(client.id).emit('messageLobby', {
        message: 'pLeft: ' + this.pLeft.pseudo,
        type: ChatMessageType.BOT,
      });
      this.server.to(client.id).emit('messageLobby', {
        message: 'pRight: ' + this.pRight.pseudo,
        type: ChatMessageType.BOT,
      });
      if (this.isMultiplayer) {
        this.server.to(client.id).emit('messageLobby', {
          message: 'pTop: ' + this.pTop.pseudo,
          type: ChatMessageType.BOT,
        });
        this.server.to(client.id).emit('messageLobby', {
          message: 'pBot: ' + this.pBot.pseudo,
          type: ChatMessageType.BOT,
        });
      }
    }
    if (this.status === GameState.GAMEOVER && this.owner.id === client.id) {
      console.info('updateClientLocal', 'gameOver');
      this.server.to(client.id).emit('gameOver', true);
    }
    if (this.status === GameState.PLAYING) {
      this.server.to(client.id).emit('messageLobby', {
        message: 'pLeft: ' + this.pLeft.pseudo,
        type: ChatMessageType.BOT,
      });
      this.server.to(client.id).emit('messageLobby', {
        message: 'pRight: ' + this.pRight.pseudo,
        type: ChatMessageType.BOT,
      });
      if (this.isMultiplayer) {
        this.server.to(client.id).emit('messageLobby', {
          message: 'pTop: ' + this.pTop.pseudo,
          type: ChatMessageType.BOT,
        });
        this.server.to(client.id).emit('messageLobby', {
          message: 'pBot: ' + this.pBot.pseudo,
          type: ChatMessageType.BOT,
        });
      }
      console.info('updateClientLocal', 'GameState.PLAYING');
    }
  }

  removeClientCB(client: ValidSocket) {
    if (this.status === GameState.INIT) {
      this.listClients.delete(client.name);
      this.userMap.delete(client.name);
      if (client.id === this.owner.id && this.listClients.size > 0) {
        const newOwner = this.listClients.values().next().value;
        this.owner = newOwner;
        this.OwnerUser = this.userMap.get(newOwner.name);
      }
      if (this.mapTimeout.has(client.name)) this.mapTimeout.delete(client.name);
      console.info('removeClientCB', client.id);
      this.serverUpdateClients();
    } else {
      const user = this.userMap.get(client.name);
      this.away.set(client.name, user);
      this.server.to(this.id).emit('messageLobby', {
        message:
          user.pseudo +
          ' is away, this lobby will selfdestruct after the game is over',
        type: ChatMessageType.SERVER,
      });
      if (this.status === GameState.PAUSE) {
        this.pongInstanceUnpause(user.pseudo);
      }
      if (this.status === GameState.START) {
        this.awayAutoAccept(user.pseudo);
        this.serverUpdateClients();
      }
    }
  }

  removeClient(@ConnectedSocket() client: ValidSocket): void | boolean {
    console.info('removeClient', client.id);
    const user = this.listClients.get(client.name);
    if (!user || user.id !== client.id) return console.info("removeClient", "Socket not known");
    client.leave(this.id);
    if (this.status === GameState.GAMEOVER) {
      this.status = GameState.AUTODESTRUCT;
      this.server.to(this.id).emit('messageLobby', {
        message: 'Lobby closed, AutoDestruction in 10s',
        type: ChatMessageType.SERVER,
      });
      this.destroyLobby(this.id);
      this.listClients.delete(client.name);
      this.userMap.delete(client.name);
      return this.serverUpdateClients();
    }
    console.info(
      'removeClient',
      'lastClient',
      this.listClients.size,
      this.away.size,
      this.mapTimeout.size,
    );
    if (this.listClients.size - this.away.size - this.mapTimeout.size === 1) {
      console.info(
        'removeClient',
        'lastClient',
        this.listClients.size,
        this.away.size,
        this.mapTimeout.size,
      );
      this.status = GameState.AUTODESTRUCT;
      this.destroyLobby(this.id);
      return;
    }
    if (this.listClients.size === 1)
      return this.listClients.delete(client.name);
    if (
      this.status === GameState.INIT ||
      this.status === GameState.AUTODESTRUCT
    ) {
      this.listClients.delete(client.name);
      this.userMap.delete(client.name);
      return this.serverUpdateClients();
    }
    if (this.status === GameState.PLAYING) {
      const user = this.userMap.get(client.name);
      this.pongInstancePause(user.pseudo);
    }

    const id = setTimeout(() => {
      return this.removeClientCB(client);
    }, 1000 * 30);
    this.mapTimeout.set(client.name, id);
  }

  //#endregion

  //#region TournamentRegion
  initTournament() {
    console.info('initTournament', this.listClients.size);
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

  protected launchMatchTournament() {
    let players: string[];
    console.info('nextplayers', this.nextPlayers);
    if (this.nextPlayers === null || this.nextPlayers === undefined) {
      players = this.tournament.nextMatch();
      if (!players) return false;
    } else {
      players = this.nextPlayers;
      this.nextPlayers = null;
    }
    this.status = GameState.INIT;
    console.info('launchMatchTournament', players);
    console.info(players);
    this.pLeft = this.userMap.get(players[0]);
    this.pRight = this.userMap.get(players[1]);
    this.playerSocketsID = [];
    this.playerSocketsID.push(this.listClients.get(players[0]).id);
    this.playerSocketsID.push(this.listClients.get(players[1]).id);
    this.initMatch(this.pLeft, this.pRight);
    this.nextPlayers = this.tournament.nextMatch();
    console.info('this.nextPlayers', this.nextPlayers);
    if (
      this.nextPlayers !== null &&
      this.nextPlayers !== undefined &&
      this.nextPlayers.length === 2
    ) {
      this.server
        .to([
          this.listClients.get(this.nextPlayers[0]).id,
          this.listClients.get(this.nextPlayers[1]).id,
        ])
        .emit('messageLobby', {
          message:
            'next match: ' + this.nextPlayers[0] + ' vs ' + this.nextPlayers[1],
          type: ChatMessageType.BOT,
        });
    }
    return true;
  }

  private tournamentMatchOver(winner: string) {
    this.winners.push(winner);
    if (
      this.nextPlayers !== null &&
      this.nextPlayers !== undefined &&
      this.nextPlayers.length === 1
    ) {
      this.winners.push(this.nextPlayers[0]);
      this.nextPlayers = null;
    }
    if (this.nextPlayers === null || this.nextPlayers === undefined) {
      if (this.winners.length === 1) {
        console.info('tournament over', this.winners);
        this.server.to(this.id).emit('messageLobby', {
          message: 'Tournament is over: winner ' + winner,
          type: ChatMessageType.BOT,
        });
        this.status = GameState.GAMEOVER;
        this.server.to(this.owner.id).emit('gameOver', true);
        this.serverUpdateClients();
        if (this.away.size > 0) {
          this.status = GameState.AUTODESTRUCT;
          this.destroyLobby(this.id);
        }
        return;
      } else {
        const players = this.winners.map((winner) => {
          for (const [key, value] of this.userMap.entries()) {
            if (value.pseudo === winner) return key;
          }
        });
        this.tournament.setNextRoundPlayers(players.reverse());
        this.winners = [];
        this.launchMatchTournament();
      }
    } else this.launchMatchTournament();
  }
  //#endregion

  //#region MatchRegion

  initMatchStart() {
    const iterator = this.userMap.entries();
    this.pLeft = iterator.next().value[1];
    this.pRight = iterator.next().value[1];
    if (this.isMultiplayer) {
      this.pTop = iterator.next().value[1];
      this.pBot = iterator.next().value[1];
    }
    this.initMatch(this.pLeft, this.pRight, this.pTop, this.pBot);
  }

  initMatch(
    pleft: LimitedUserDto,
    pright: LimitedUserDto,
    ptop?: LimitedUserDto,
    pbot?: LimitedUserDto,
  ) {
    if (this.isClassic || this.isTournament) {
      this.pongInstance = new Pong(
        this,
        this.id,
        this.server,
        pleft.pseudo,
        pright.pseudo,
      );
      this.server.to(this.id).emit('messageLobby', {
        message:
          'Game is starting: ' +
          this.pLeft.pseudo +
          ' vs ' +
          this.pRight.pseudo,
        type: ChatMessageType.BOT,
      });
    } else if (this.isMultiplayer) {
      this.pongInstance = new Pong4p(
        this,
        this.id,
        this.server,
        pleft.pseudo,
        pright.pseudo,
        ptop.pseudo,
        pbot.pseudo,
      );
      this.server.to(this.id).emit('messageLobby', {
        message: `Game is starting: ${this.pLeft.pseudo} vs ${this.pRight.pseudo} vs ${this.pTop.pseudo} vs ${this.pBot.pseudo}`,
        type: ChatMessageType.BOT,
      });
    }
    this.status = GameState.START;
    if (this.isTournament) {
      this.server.to(this.playerSocketsID).emit('isPlayerReady');
    } else this.server.to(this.id).emit('isPlayerReady');
    if (this.away.size > 0) {
      this.away.forEach((user) => {
        this.awayAutoAccept(user.pseudo);
      });
    }
    this.serverUpdateClients();
  }

  public pongInstanceEnd(log: any) {
    const matchLog: MatchDto = {
      gameType: this.gameType,
      ...log,
    };
    console.info('game over', matchLog, this.id);
    this.status = GameState.GAMEOVER;
    this.matchlog = matchLog;
    this.saveMatch(matchLog);
    if (this.isTournament || this.isClassic) {
      const winner =
        matchLog.scoreP1 > matchLog.scoreP2 ? this.pLeft : this.pRight;
      if (this.isTournament) {
        this.tournamentMatchOver(winner.pseudo);
        return;
      } else {
        this.server.to(this.id).emit('messageLobby', {
          message: 'Game is over: winner ' + winner.pseudo,
          type: ChatMessageType.BOT,
        });
      }
    } else if (this.isMultiplayer) {
      this.server.to(this.id).emit('messageLobby', {
        message: 'Game is over: winner ' + matchLog?.winnerPseudo,
        type: ChatMessageType.BOT,
      });
    }
    this.serverUpdateClients();
    this.server.to(this.owner.id).emit('gameOver', matchLog);
    if (this.away.size > 0) {
      this.status = GameState.AUTODESTRUCT;
      this.destroyLobby(this.id);
    }
  }

  nextMatch() {
    if (this.status !== GameState.GAMEOVER) return;
    this.status = GameState.INIT;
    this.pongInstance = null;
    if (this.isClassic) this.initMatch(this.pLeft, this.pRight);
    else if (this.isMultiplayer) {
      this.initMatch(this.pLeft, this.pRight, this.pTop, this.pBot);
    } else if (this.isTournament) {
      this.initTournament();
    }
  }

  //#endregion

  //#region InputRegion

  startMatch(pseudo: string) {
    if (this.pongInstance) {
      this.pongInstance.startMatch(pseudo)
        ? (this.status = GameState.PLAYING)
        : null;
      this.serverUpdateClients();
    }
  }

  private inputGame(input: EventGame.UP | EventGame.DOWN, pseudo: string) {
    if (this.status !== GameState.PLAYING || !this.pongInstance) return;
    if (pseudo === this.pLeft.pseudo || pseudo === this.pRight.pseudo) {
      this.pongInstance.onInput(input, pseudo);
    }
  }

  private inputGame4P(input: EventGame.LEFT | EventGame.RIGHT, pseudo: string) {
    if (this.status !== GameState.PLAYING || !this.pongInstance) return;
    if (pseudo === this.pRight.pseudo || pseudo === this.pBot.pseudo) {
      const pong4p = this.pongInstance as Pong4p;
      pong4p.onInput(input, pseudo);
    }
  }

  pongInstanceUnpause(pseudo: string) {
    if (!this.pongInstance) return;
    if (this.status !== GameState.PAUSE) return;
    if (this.isClassic || this.isTournament) {
      if (this.pLeft.pseudo !== pseudo && this.pRight.pseudo !== pseudo) return;
      this.status = GameState.PLAYING;
      this.pongInstance.pause();
    } else if (this.isMultiplayer) {
      if (
        this.pLeft.pseudo !== pseudo &&
        this.pRight.pseudo !== pseudo &&
        this.pTop.pseudo !== pseudo &&
        this.pBot.pseudo !== pseudo
      )
        return;
      this.status = GameState.PLAYING;
      this.pongInstance.pause();
    }
    this.serverUpdateClients();
  }

  pongInstancePause(pseudo: string) {
    if (!this.pongInstance) return;
    if (this.status !== GameState.PLAYING) return;
    if (this.isClassic || this.isTournament) {
      if (this.pLeft.pseudo !== pseudo && this.pRight.pseudo !== pseudo) return;
      this.status = GameState.PAUSE;
      this.pongInstance.pause();
      console.info('pause', this.status);
    } else if (this.isMultiplayer) {
      if (
        this.pLeft.pseudo !== pseudo &&
        this.pRight.pseudo !== pseudo &&
        this.pTop.pseudo !== pseudo &&
        this.pBot.pseudo !== pseudo
      )
        return;
      console.info('pongInstancePause', this.status);
      this.status = GameState.PAUSE;
      this.pongInstance.pause();
    }
    this.serverUpdateClients();
  }

  public onInput(
    @ConnectedSocket() client: ValidSocket,
    input: EventGame,
    pseudo: string,
  ) {
    switch (input) {
      case EventGame.ARROW_UP:
        return this.inputGame(EventGame.UP, pseudo);
      case EventGame.ARROW_DOWN:
        return this.inputGame(EventGame.DOWN, pseudo);
      case EventGame.W_KEY:
        return this.inputGame(EventGame.UP, pseudo);
      case EventGame.S_KEY:
        return this.inputGame(EventGame.DOWN, pseudo);
      case EventGame.ARROW_LEFT:
        return this.inputGame4P(EventGame.LEFT, pseudo);
      case EventGame.ARROW_RIGHT:
        return this.inputGame4P(EventGame.RIGHT, pseudo);
      case EventGame.A_KEY:
        return this.inputGame4P(EventGame.LEFT, pseudo);
      case EventGame.D_KEY:
        return this.inputGame4P(EventGame.RIGHT, pseudo);
      case EventGame.START_MATCH:
        return this.startMatch(pseudo);
      case EventGame.START_TOURNAMENT: {
        this.maxClients = this.listClients.size;
        return this.initTournament();
      }
      case EventGame.PAUSE:
        return this.pongInstancePause(pseudo);
      case EventGame.NEXT:
        return this.nextMatch();
    }
  }

  public onInputs(
    @ConnectedSocket() client: ValidSocket,
    inputs: EventGame[],
    pseudo: string,
  ) {
    inputs.forEach(input => {
      switch (input) {
        case EventGame.ARROW_UP:
          return this.inputGame(EventGame.UP, pseudo);
        case EventGame.ARROW_DOWN:
          return this.inputGame(EventGame.DOWN, pseudo);
        case EventGame.W_KEY:
          return this.inputGame(EventGame.UP, pseudo);
        case EventGame.S_KEY:
          return this.inputGame(EventGame.DOWN, pseudo);
        case EventGame.ARROW_LEFT:
          return this.inputGame4P(EventGame.LEFT, pseudo);
        case EventGame.ARROW_RIGHT:
          return this.inputGame4P(EventGame.RIGHT, pseudo);
        case EventGame.A_KEY:
          return this.inputGame4P(EventGame.LEFT, pseudo);
        case EventGame.D_KEY:
          return this.inputGame4P(EventGame.RIGHT, pseudo);
      }
    })
  }

  //#endregion

  //#region APIRegion

  public getGameUpdate() {
    if (!this.pongInstance) return null;
    return this.pongInstance.getStateOfGame();
  }

  public getMatchLog() {
    return this.matchlog;
  }

  public movePlayerCLI(
    pseudo: string,
    input: EventGame.UP | EventGame.DOWN | EventGame.LEFT | EventGame.RIGHT,
  ) {
    if (!this.pongInstance) return { sucess: false, error: 'no pongInstance' };
    if (
      this.isMultiplayer &&
      (pseudo === this.pTop.pseudo ||
        pseudo === this.pBot.pseudo ||
        pseudo === this.pLeft.pseudo ||
        pseudo === this.pRight.pseudo)
    ) {
      const pong4 = this.pongInstance as Pong4p;
      pong4.onInput(input, pseudo);
      return { sucess: true };
    } else if (pseudo === this.pLeft.pseudo || pseudo === this.pRight.pseudo) {
      if (input === EventGame.UP || input === EventGame.DOWN) {
        this.pongInstance.onInput(
          input as EventGame.UP | EventGame.DOWN,
          pseudo,
        );
        return { sucess: true };
      } else
        return {
          sucess: false,
          error: 'wrong input UP and DOWN only in classic pong',
        };
    }
    return { sucess: false, error: 'pseudo not found' };
  }

  public startGameCLI(pseudo: string) {
    if (!this.pongInstance)
      return { sucess: false, error: 'no pongInstance', status: 404 };
    if (
      pseudo === this.pLeft.pseudo ||
      pseudo === this.pRight.pseudo ||
      (this.isMultiplayer &&
        (pseudo === this.pTop.pseudo || pseudo === this.pBot.pseudo))
    ) {
      if (this.pongInstance.startMatch(pseudo)) {
        this.status = GameState.PLAYING;
        this.serverUpdateClients();
        return { sucess: true, msg: 'match has started' };
      }
      this.serverUpdateClients();
      return { sucess: true, msg: 'some players are not ready' };
    }
    return { sucess: false, error: 'player not found' };
  }

  public onPauseCLI(pseudo: string) {
    if (!this.pongInstance)
      return { sucess: false, error: 'no pongInstance', status: 404 };
    if (
      pseudo === this.pLeft.pseudo ||
      pseudo === this.pRight.pseudo ||
      (this.isMultiplayer &&
        (pseudo === this.pTop.pseudo || pseudo === this.pBot.pseudo))
    ) {
      if (this.status === GameState.PLAYING) {
        this.status = GameState.PAUSE;
        this.pongInstance.pause();
        this.serverUpdateClients();
        return { sucess: true, msg: 'game in pause' };
      } else return { sucess: false, msg: 'game is not playing' };
    }
    return { sucess: false, error: 'player not found' };
  }

  public onUnpauseCLI(pseudo: string) {
    if (!this.pongInstance)
      return { sucess: false, error: 'no pongInstance', status: 404 };
    if (
      pseudo === this.pLeft.pseudo ||
      pseudo === this.pRight.pseudo ||
      (this.isMultiplayer &&
        (pseudo === this.pTop.pseudo || pseudo === this.pBot.pseudo))
    ) {
      if (this.status === GameState.PAUSE) {
        this.status = GameState.PLAYING;
        this.pongInstance.pause();
        this.serverUpdateClients();
        return { sucess: true, msg: 'game resumed' };
      } else return { sucess: false, msg: 'game is not in pause' };
    }
    return { sucess: false, error: 'player not found' };
  }

  public getPlayerReady() {
    if (!this.pongInstance) return { sucess: false, error: 'no pongInstance' };
    return this.pongInstance.getPlayersReady();
  }

  public reMatchCLI() {
    if (this.status !== GameState.GAMEOVER)
      return { sucess: false, error: 'game is not over' };
    this.nextMatch();
    return { sucess: true };
  }
  //#endregion

  //#region UtilsRegion

  public getPlayers(): string[] {
    const players = [];
    for (const [key, value] of this.userMap.entries()) {
      players.push(key);
    }
    console.info('getPlayers', players);
    return players;
  }

  getSize() {
    return this.listClients.size;
  }

  getOwner() {
    return this.owner;
  }

  private awayAutoAccept(pseudo: string) {
    if (
      pseudo === this.pLeft.pseudo ||
      pseudo === this.pRight.pseudo ||
      (this.isMultiplayer &&
        (pseudo === this.pTop.pseudo || pseudo === this.pBot.pseudo))
    ) {
      if (this.pongInstance.startMatch(pseudo)) this.status = GameState.PLAYING;
      this.server.to(this.id).emit('messageLobby', {
        message: pseudo + ' is away, auto-accept',
        type: ChatMessageType.SERVER,
      });
    }
  }

  sendChatMessage(to: string, message: string, type: ChatMessageType) {
    this.server.to(to).emit('messageLobby', {
      message: message,
      type: type,
    });
  }

  getUpdateLobbyDto(): UpdateLobbyDto {
    const pong4p = this.pongInstance as Pong4p;
    const pReady = pong4p?.getPlayersReady();
    let ret = {
      nbPlayer: this.listClients.size,
      maxClients: this.maxClients,
      pLeftReady: pReady?.p1,
      pRightReady: pReady?.p2,
      gameState: this.status,
      pLeft: this.pLeft,
      pRight: this.pRight,
    };
    if (this.isClassic) {
      if (this.status === GameState.INIT && this.pLeft && this.pRight) {
        this.status = GameState.START;
        ret.gameState = GameState.START;
      }
      return ret;
    }
    console.info('getUpdateLobbyDto', this.pTop, this.pBot);
    if (
      this.pLeft &&
      this.pRight &&
      this.pTop &&
      this.pBot &&
      this.status === GameState.INIT
    ) {
      this.status = GameState.START;
      ret.gameState = GameState.START;
    }
    return {
      ...ret,
      pTop: this.pTop,
      pBot: this.pBot,
      pTopReady: pReady?.p3,
      pBotReady: pReady?.p4,
    };
  }

  serverUpdateClients() {
    const lobbyState = this.getUpdateLobbyDto();
    this.server.to(this.id).emit('updateLobby', lobbyState);
  }
  public forcedLeave() {
    this.server.to(this.id).emit('forcedLeave', 'Lobby closed');
    this.listClients.forEach((client) => {
      client.leave(this.id);
    });
  }

  private async saveMatch(matchLog: MatchDto) {
    return await this.userService.createMatchDB(matchLog);
  }

  public getOwnerPseudo() {
    if (this.OwnerUser) return this.OwnerUser.pseudo;
    return null;
  }

  public shuffle(array: string[]) {
    var m = array.length,
      t,
      i;

    while (m) {
      i = Math.floor(Math.random() * m--);

      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }
  //#endregion
}
