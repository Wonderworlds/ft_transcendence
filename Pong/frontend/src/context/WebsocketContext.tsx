import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_BURL);
export const PrincipalWebsocketContext = createContext<Socket>(socket);

export const WebsocketProvider = PrincipalWebsocketContext.Provider;
