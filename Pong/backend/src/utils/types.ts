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
  ARROW_UP = 'ARROW_UP',
  ARROW_DOWN = 'ARROW_DOWN',
  W_KEY = 'W_KEY',
  S_KEY = 'S_KEY',
  SPACE_KEY = 'SPACE_KEY',
}

export type Pos = {
  x: number;
  y: number;
};
