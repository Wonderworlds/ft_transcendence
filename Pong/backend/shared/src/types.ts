import { Socket } from 'socket.io';

export enum Status {
  Online = 'Online',
  Offline = 'Offline',
  DnD = 'Do Not Disturb',
  Busy = 'Busy',
}

export type Success = {
  success: boolean;
};

export type ValidSocket = Socket & {
  name: string;
};

export enum roomProtection {
  public = 'Public',
  private = 'Private',
  protected = 'Protected',
}

export enum eventGame {
  UP = 'UP',
  DOWN = 'DOWN',
}
