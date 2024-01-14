import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { PongService } from 'src/pong/pong.service';
import { UsersService } from 'src/users/users.service';
import { messageLobbyDto } from 'src/utils/Dtos';
import { ChatMessageType, Success, ValidSocket } from 'src/utils/types';
import { WebsocketService } from 'src/websocket/websocket.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly userService: UsersService,
    public websocketService: WebsocketService,
    public pongService: PongService,
  ) {}

  public async sendPrivateMessage(
    @ConnectedSocket() user: ValidSocket,
    body: messageLobbyDto,
  ) {
    console.info(`event [privateMessage]`, user.name, body.message);
    const userDB = await this.userService.findOneUser(
      { username: user.name },
      ['blockedBy'],
      ['blockedBy', 'pseudo', 'ppImg', 'id'],
    );
    if (!userDB)
      return this.websocketService.serverError([user.id], 'user not found');
    const to = body.message.split(' ')[0].slice(1).toLowerCase();
    if (to === userDB.pseudo)
      return this.responseServer(
        user,
        'error: you cannot send a private message to yourself',
      );
    if (userDB.blockedBy.length !== 0) {
      const blockedBy = userDB.blockedBy.find((e) => {
        if (e.pseudo === to) {
          return e.username;
        }
      });
      if (blockedBy)
        return this.responseServer(user, 'error: you are blocked by ' + to);
    }
    const toUser = await this.userService.findOneUser(
      { pseudo: to },
      [],
      ['username', 'id'],
    );
    if (!toUser)
      return this.websocketService.server.to(user.id).emit('messageLobby', {
        message: to + " doesn't exist",
        type: ChatMessageType.SERVER,
      });
    const socketTo = this.websocketService.users.get(toUser.username);
    if (!socketTo || !socketTo.rooms.has(body.lobby))
      return this.responseServer(
        user,
        'error: ' + to + ' not connected to the lobby',
      );

    this.websocketService.server.to([socketTo.id, user.id]).emit('messageLobby', {
      message: body.message,
      from: { pseudo: userDB.pseudo, ppImg: userDB.ppImg },
      type: ChatMessageType.PRIVATE,
    });
    
  }

  public async sendMessageRoom(
    @ConnectedSocket() user: ValidSocket,
    body: messageLobbyDto,
  ) {
    console.info(`event [sendMessageRoom]`, user.name, body.message);
    const userDB = await this.userService.findOneUser(
      { username: user.name },
      ['blockedBy'],
      ['blockedBy', 'pseudo', 'ppImg', 'id'],
    );
    if (!userDB)
      return this.websocketService.serverError([user.id], 'user not found');
    const blockedBy = userDB.blockedBy.map((e) => {
      return e.username;
    });
    console.info(`event [sendMessageRoom]`, userDB.pseudo, blockedBy);
    const blockedByID = userDB.blockedBy.map((e) => {
      const tmp = this.websocketService.users.get(e.username);
      if (tmp) return tmp.id;
    });
    this.websocketService.server
      .to(body.lobby)
      .except(blockedByID)
      .emit('messageLobby', {
        message: body.message,
        from: { pseudo: userDB.pseudo, ppImg: userDB.ppImg },
        type: ChatMessageType.STANDARD,
      });
  }

  private readonly helpMessage = `/help : show this message
	/block @pseudo : block a user
	/unblock @pseudo : unblock a user
	/invite @pseudo : invite a user to a custom game
	/addFriend @pseudo : add a user to your friend list`;

  private responseServer(
    @ConnectedSocket() user: ValidSocket,
    message: string,
  ) {
    return this.websocketService.server.to(user.id).emit('messageLobby', {
      message: message,
      type: ChatMessageType.SERVER,
    });
  }

  public sendWelcomeMessage(@ConnectedSocket() user: ValidSocket) {
    return this.websocketService.server.to(user.id).emit('messageLobby', {
      message: 'welcome to the chat lobby',
      type: ChatMessageType.BOT,
    });
  }

  public sendNewUserMessage(lobby: string) {
    return this.websocketService.server.to(lobby).emit('messageLobby', {
      message: 'a new user joined the lobby',
      type: ChatMessageType.BOT,
    });
  }

  public sendUserLeaveMessage(lobby: string) {
    return this.websocketService.server.to(lobby).emit('messageLobby', {
      message: 'a user left the lobby',
      type: ChatMessageType.BOT,
    });
  }


  private async commandBlock(
    @ConnectedSocket() user: ValidSocket,
    pseudo: string,
  ) {
    console.info(`event [commandBlock]`, user.name, pseudo);
    if (pseudo[0] !== '@')
      return this.responseServer(user, 'error: invalid pseudo: missing @');
    pseudo = pseudo.slice(1).toLowerCase();
    try {
      const res: Success = await this.userService.blockUser(user.name, pseudo);
      return res.success
        ? this.responseServer(user, 'you blocked ' + pseudo)
        : this.responseServer(user, 'error: block failed');
    } catch (error) {
      return this.responseServer(user, 'error: ' + error.message);
    }
  }

  private async commandUnblock(
    @ConnectedSocket() user: ValidSocket,
    pseudo: string,
  ) {
    console.info(`event [commandUnblock]`, user.name, pseudo);
    if (pseudo[0] !== '@')
      return this.responseServer(user, 'error: invalid pseudo: missing @');
    pseudo = pseudo.slice(1).toLowerCase();
    try {
      const res: Success = await this.userService.unblockUser(
        user.name,
        pseudo,
      );
      return res.success
        ? this.responseServer(user, 'you unblocked ' + pseudo)
        : this.responseServer(user, 'error: unblock failed');
    } catch (error) {
      return this.responseServer(user, 'error: ' + error.message);
    }
  }

  private async commandInvite(
    @ConnectedSocket() user: ValidSocket,
    pseudo: string,
  ) {
    console.info(`event [commandInvite]`, user.name, pseudo);
    if (pseudo[0] !== '@')
      return this.responseServer(user, 'error: invalid pseudo: missing @');
    pseudo = pseudo.slice(1).toLowerCase();
    const userDB = await this.userService.findOneUser(
      { username: user.name },
      ['blockedBy'],
      ['pseudo', 'id', 'blockedBy'],
    );
    if (userDB.pseudo === pseudo)
      return this.responseServer(user, 'error: you cannot invite yourself');
    console.info(`event [commandInvite]`, userDB.pseudo, pseudo);
    if (userDB.blockedBy.length !== 0) {
      const blockedBy = userDB.blockedBy.find((e) => {
        if (e.pseudo === pseudo) {
          return e.username;
        }
      });
      if (blockedBy)
        return this.responseServer(user, 'error: you are blocked by ' + pseudo);
    }
    console.info(`event [commandInvite]`, userDB.pseudo, pseudo);
    const friendDB = await this.userService.findOneUser(
      { pseudo: pseudo },
      [],
      ['pseudo', 'username', 'id'],
    );
    console.info(`event [commandInvite]`, userDB.pseudo, friendDB.pseudo);
    if (!userDB || !friendDB)
      return this.responseServer(user, 'error: target not found');
    const friendSocket = this.websocketService.users.get(friendDB.username);
    if (!friendSocket || !friendSocket.rooms.has('Mainchat'))
      return this.responseServer(user, 'error: user offline');
    console.info(`event [commandInvite]`, userDB.pseudo, friendDB.pseudo);
    const res = await this.pongService.customGame(
      user,
      { owner: userDB.pseudo, friend: friendDB.pseudo },
      this.websocketService.server,
      this.websocketService,
    );
    if (res.event === 'error')
      this.websocketService.serverError(res.to, res.messagePayload as string);
    else {
      this.websocketService.server.to(friendSocket.id).emit('messageLobby', {
        ...res.messagePayload as {lobby: string, sender: string},
        type: ChatMessageType.INVITE,
      });
      this.responseServer(user, 'invite sent');
    }
  }

  private async commandAddFriend(
    @ConnectedSocket() user: ValidSocket,
    pseudo: string,
  ) {
    console.info(`event [commandAddFriend]`, user.name, pseudo);
    if (pseudo[0] !== '@')
      return this.responseServer(user, 'error: invalid pseudo: missing @');
    pseudo = pseudo.slice(1).toLowerCase();
    try {
      const friend = await this.userService.findOneUser(
        { pseudo: pseudo },
        ['blocked'],
        ['username', 'id', 'pseudo', 'blocked'],
      );
      if (!friend) return this.responseServer(user, 'error: user not found');
      if (friend.username === user.name)
        return this.responseServer(user, 'error: you cannot add yourself');
      if (friend.blocked.length !== 0) {
        const blocked = friend.blocked.find((e) => {
          if (e.pseudo === user.name) {
            return e.username;
          }
        });
        if (blocked)
          return this.responseServer(
            user,
            'error: you are blocked by ' + pseudo,
          );
      }
      const friendID = this.websocketService.users.get(friend.username);
      const res = await this.userService.sendFriendDemand(user.name, pseudo);
      const userDB = await this.userService.findOneUser(
        { username: user.name },
        [],
        ['pseudo', 'ppImg', 'id'],
      );
      if (!userDB) return this.responseServer(user, 'error: user not found');
      if (res.success) {
        this.responseServer(user, 'demand sent');
        if (friendID)
          this.responseServer(friendID, 'you have a new friend demand');
        return this.websocketService.server
          .to(friendID.id)
          .emit('messageLobby', {
            message: "you've sent a friend demand to " + pseudo,
            from: { pseudo: userDB.pseudo, ppImg: userDB.ppImg },
            type: ChatMessageType.DEMAND,
          });
      }
      return this.responseServer(user, 'error: demand failed');
    } catch (error) {
      return this.responseServer(user, 'error: ' + error.message);
    }
  }

  private async commandProfile(
    @ConnectedSocket() user: ValidSocket,
    pseudo: string,
  ) {
    console.info(`event [commandProfile]`, user.name, pseudo);
    if (pseudo[0] !== '@')
      return this.responseServer(user, 'error: invalid pseudo: missing @');
    pseudo = pseudo.slice(1).toLowerCase();
    const friend = await this.userService.findUserByPseudo(pseudo);
    if (!friend) return this.responseServer(user, `error: ${pseudo} not found`);
    const friendID = this.websocketService.users.get(friend.username);
    if (!friendID)
      return this.responseServer(user, `error: ${pseudo} not connected`);
    return this.websocketService.server.to(user.id).emit('messageLobby', {
      message: pseudo,
      type: ChatMessageType.PROFILE,
    });
  }

  public sendCommandMessage(
    @ConnectedSocket() user: ValidSocket,
    body: messageLobbyDto,
  ) {
    console.info(`event [sendCommandMessage]`, user.name, body.message);
    const msgSplit = body.message.split(' ');
    const command = msgSplit[0].slice(1).toLowerCase();
    switch (command) {
      case 'help':
        return this.websocketService.server.to(user.id).emit('messageLobby', {
          message: this.helpMessage,
          type: ChatMessageType.BOT,
        });
      case 'block':
        return this.commandBlock(user, msgSplit[1]);
      case 'unblock':
        return this.commandUnblock(user, msgSplit[1]);
      case 'invite': {
        if (body.lobby !== 'Mainchat')
          return this.responseServer(
            user,
            'error: you can only invite in the main chat lobby',
          );
        else return this.commandInvite(user, msgSplit[1]);
      }
      case 'addfriend':
        return this.commandAddFriend(user, msgSplit[1]);
      case 'profile':
        return this.commandProfile(user, msgSplit[1]);
      default:
        return this.responseServer(
          user,
          'error: command ' + command + ' unknown: type /help to see the list',
        );
    }
  }

  public getMessageType(message: string): ChatMessageType {
    if (message[0] === '/') return ChatMessageType.COMMAND;
    if (message[0] === '@') return ChatMessageType.PRIVATE;
    if (message[0] === '!') return ChatMessageType.BOT;
    if (message[0] === '\0') return ChatMessageType.UNDEFINED;
    return ChatMessageType.STANDARD;
  }

  public isClientInLobby(
    @ConnectedSocket() user: ValidSocket,
    lobby: string,
  ): boolean {
    return user.rooms.has(lobby);
  }
}
