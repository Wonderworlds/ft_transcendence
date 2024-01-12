import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { UsersService } from 'src/users/users.service';
import { messageLobbyDto } from 'src/utils/Dtos';
import { Success, ValidSocket } from 'src/utils/types';
import { WebsocketService } from 'src/websocket/websocket.service';

export enum ChatMessageType {
  STANDARD = 'STANDARD',
  PRIVATE = 'PRIVATE',
  COMMAND = 'COMMAND',
  BOT = 'BOT',
  SERVER = 'SERVER',
  UNDEFINED = 'UNDEFINED',
}
@Injectable()
export class ChatService {
  constructor(
    private readonly userService: UsersService,
    public websocketService: WebsocketService,
  ) {}

  public async sendPrivateMessage(
    @ConnectedSocket() user: ValidSocket,
    body: messageLobbyDto,
  ) {
    console.info(`event [privateMessage]`, user.name, body.message);
    const userDB = await this.userService.findOneUser({ username: user.name }, [
      'blockedBy',
      'pseudo',
      'ppImg',
    ]);
    if (!userDB)
      return this.websocketService.serverError([user.id], 'user not found');
    const to = body.message.split(' ')[0].slice(1);
    const blockedBy = userDB.blockedBy.find((e) => {
      if (e.pseudo === to) {
        return e.username;
      }
    });
    if (blockedBy)
      return this.websocketService.serverError(
        [user.id],
        'you are blocked by this user',
      );
    const toUser = await this.userService.findOneUser(
      { pseudo: to },
      [],
      ['username'],
    );
    if (!toUser)
      return this.websocketService.server.to(user.id).emit('messageLobby', {
        message: to + " doesn't exist",
        type: ChatMessageType.SERVER,
      });
    const socketTo = this.websocketService.users.get(toUser.username);
    if (!socketTo || !socketTo.rooms.has(body.lobby))
      return this.websocketService.server.to(user.id).emit('messageLobby', {
        message: to + ' not connected to the lobby',
        type: ChatMessageType.SERVER,
      });
    this.websocketService.server.to(socketTo.id).emit('messageLobby', {
      message: body.message,
      from: { pseudo: userDB.pseudo, ppImg: userDB.ppImg },
      type: ChatMessageType.PRIVATE,
    });
  }

  public async sendMessageRoom(
    @ConnectedSocket() user: ValidSocket,
    body: messageLobbyDto,
  ) {
    const userDB = await this.userService.findOneUser(
      { username: user.name },
      ['blockedBy'],
      ['blockedBy', 'pseudo', 'ppImg'],
    );
    if (!userDB)
      return this.websocketService.serverError([user.id], 'user not found');
    const blockedBy = userDB.blockedBy.map((e) => {
      return e.username;
    });
    console.info(`event [sendMessageRoom]`, userDB.pseudo, blockedBy);
    const blockedByID = userDB.blockedBy.map((e) => {
      return this.websocketService.users.get(e.username).id;
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

  private readonly helpMessage = `
	/help : show this message
	/block @pseudo : block a user
	/unblock @pseudo : unblock a user
	/invite @pseudo : invite a user to a custom game
	/addFriend @pseudo : add a user to your friend list
	/cheer @pseudo : cheer a user
	`;

  private responseServer(@ConnectedSocket() user: ValidSocket, message: string) {
	return this.websocketService.server.to(user.id).emit('messageLobby', {
        message: message,
        type: ChatMessageType.SERVER,
      });
  }

  private async commandBlock(
    @ConnectedSocket() user: ValidSocket,
    pseudo: string,
  ) {
    console.info(`event [commandBlock]`, user.name, pseudo);
    if (pseudo[0] !== '@')
      return this.responseServer(user, 'error: invalid pseudo: missing @');
    pseudo = pseudo.slice(1);
    try {
      const res: Success = await this.userService.blockUser(user.name, pseudo);
      return res.success
        ? 
		this.responseServer(user, 'you blocked ' + pseudo)
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
    pseudo = pseudo.slice(1);
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
    pseudo = pseudo.slice(1);
    const userDB = await this.userService.findOneUser(
      { username: user.name },
      [],
      ['pseudo'],
    );
    const friendDB = await this.userService.findOneUser(
      { pseudo: pseudo },
      [],
      ['pseudo'],
    );
    if (!userDB || !friendDB)
      return this.responseServer(user, 'error: user not found');
    user.emit('customGame', { owner: userDB.pseudo, friend: pseudo });
  }

  private async commandAddFriend(
    @ConnectedSocket() user: ValidSocket,
    pseudo: string,
  ) {
    console.info(`event [commandAddFriend]`, user.name, pseudo);
    if (pseudo[0] !== '@')
      return this.responseServer(user, 'error: invalid pseudo: missing @');
    pseudo = pseudo.slice(1);
    try {
      const res = await this.userService.sendFriendDemand(user.name, pseudo);
	  const friend = await this.userService.findOneUser({ pseudo: pseudo }, [], ['username']);
	  const friendID = this.websocketService.users.get(friend.username);
      if (res.success) {
		this.responseServer(user, 'demand sent');
		this.responseServer(friendID, 'you have a new friend demand');
        return;
      }
	  return this.responseServer(user, 'error: demand failed');
    } catch (error) {
		return this.responseServer(user, 'error: ' + error.message);
    }
  }

  public sendCommandMessage(
    @ConnectedSocket() user: ValidSocket,
    body: messageLobbyDto,
  ) {
    console.info(`event [sendCommandMessage]`, user.name, body.message);
    const msgSplit = body.message.split(' ');
    const command = msgSplit[0].slice(1);
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
      case 'invite':
        return this.commandInvite(user, msgSplit[1]);
      case 'addFriend':
        return this.commandAddFriend(user, msgSplit[1]);
      default:
		return this.responseServer(user, 'error: command ' + command + ' unknown: type /help to see the list');
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
