import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameState, LobbyDto } from '../utils/dtos';
import { EventGame, Pages, User } from '../utils/types';
import { getUser } from './UserContext';
import { getSocket } from './WebsocketContext';

type GameContextType = {
	playerLeft: User;
	setPlayerLeft: React.Dispatch<React.SetStateAction<User>>;
	playerRight: User;
	setPlayerRight: React.Dispatch<React.SetStateAction<User>>;
	scorePLeft: number;
	setScorePLeft: React.Dispatch<React.SetStateAction<number>>;
	scorePRight: number;
	setScorePRight: React.Dispatch<React.SetStateAction<number>>;
	gameType: string;
	setGameType: React.Dispatch<React.SetStateAction<string>>;
	nbPlayer: number;
	setNbPlayer: React.Dispatch<React.SetStateAction<number>>;
	maxPlayer: number;
	setMaxPlayer: React.Dispatch<React.SetStateAction<number>>;
	playerReady: boolean;
	setPlayerReady: React.Dispatch<React.SetStateAction<boolean>>;
	gameState: GameState;
	setGameState: React.Dispatch<React.SetStateAction<GameState>>;
	tournamentIsReady: boolean;
	setTournamentIsReady: React.Dispatch<React.SetStateAction<boolean>>;
	playerIsReady1: boolean;
	setPlayerIsReady1: React.Dispatch<React.SetStateAction<boolean>>;
	playerIsReady2: boolean;
	setPlayerIsReady2: React.Dispatch<React.SetStateAction<boolean>>;
	nextMatch(): void;
	startMatch(): void;
	startTournament(): void;
	addClientLocal(pseudo: string): void;
};

export type UpdateLobbyDto = {
	nbPlayer: number;
	pLeftReady: boolean;
	pRightReady: boolean;
	gameState: GameState;
	pLeft?: User;
	pRight?: User;
};

export const GameContext = createContext({} as GameContextType);

export const GameContextProvider = ({ children }: { children: React.ReactNode }) => {
	const socketContext = getSocket();
	const socket = socketContext.socket;
	const navigate = useNavigate();
	const user = getUser();
	const [playerLeft, setPlayerLeft] = React.useState<User>({} as User);
	const [playerRight, setPlayerRight] = React.useState<User>({} as User);
	const [scorePLeft, setScorePLeft] = React.useState<number>(0);
	const [scorePRight, setScorePRight] = React.useState<number>(0);
	const [gameType, setGameType] = React.useState<string>('');
	const [nbPlayer, setNbPlayer] = React.useState<number>(0);
	const [maxPlayer, setMaxPlayer] = React.useState<number>(24);
	const [playerReady, setPlayerReady] = React.useState<boolean>(true);
	const [playerIsReady1, setPlayerIsReady1] = React.useState<boolean>(false);
	const [playerIsReady2, setPlayerIsReady2] = React.useState<boolean>(false);
	const [tournamentIsReady, setTournamentIsReady] = React.useState<boolean>(false);
	const [gameState, setGameState] = React.useState<GameState>(GameState.INIT);

	useEffect(() => {
		if (!socket) return;
		socket.on('joinedLobby', (res: LobbyDto) => {
			if (!res.id) navigate(Pages.WaitingMatch);
			else if (!socketContext.lobby) {
				return socketContext.setLobby(res.id);
			} else {
				setMaxPlayer(res.maxPlayers);
				setNbPlayer(res.nbPlayers);
				setGameType(res.gameType);
			}
		});
		const test = { lobby: socketContext.lobby, ...user.getUserLimited() };

		socket.emit('joinLobby', test);

		socket.on('updateLobby', (res: UpdateLobbyDto) => {
			setNbPlayer(res.nbPlayer);
			setPlayerIsReady1(res.pLeftReady);
			setPlayerIsReady2(res.pRightReady);
			setGameState(res.gameState);
			res.pLeft && setPlayerLeft(res.pLeft);
			res.pRight && setPlayerRight(res.pRight);
			res.gameState === GameState.START && setPlayerReady(false);
		});

		socket.on('tournamentIsReady', () => {
			setTournamentIsReady(true);
		});

		socket.on('isPlayerReady', () => {
			setPlayerReady(false);
		});

		socket.on('gameOver', (res) => {
			console.log('gameOver', res);
			setGameState(GameState.GAMEOVER);
		});

		return () => {
			socket.off('gameOver');
			socket.off('tournamentIsReady');
			socket.off('isPlayerReady');
			socket.off('joinedLobby');
			socket.off('updateLobby');
			socket.emit('leaveLobby', { lobby: socketContext.lobby });
		};
	}, [socket, socketContext.lobby]);

	function startMatch() {
		if (!socket) return;
		const payload = {
			lobby: socketContext.lobby,
			input: EventGame.START_MATCH,
			pseudo: user.pseudo,
		};
		socket.emit('input', payload);
		setPlayerReady(true);
	}

	function startTournament() {
		if (!socket) return;
		socket.emit('startTournament', { lobby: socketContext.lobby, pseudo: user.pseudo });
		setTournamentIsReady(false);
	}

	function addClientLocal(pseudo: string) {
		if (!socket) return;
		socket.emit('addClientLocal', {
			lobby: socketContext.lobby,
			...user.getUserLimited(),
			pseudo: pseudo,
		});
	}

	function nextMatch() {
		if (!socket) return;
		const payload = {
			lobby: socketContext.lobby,
			input: EventGame.NEXT,
			pseudo: user.pseudo,
		};
		socket.emit('input', payload);
	}

	return (
		<GameContext.Provider
			value={{
				playerLeft,
				setPlayerLeft,
				playerRight,
				setPlayerRight,
				scorePLeft,
				setScorePLeft,
				scorePRight,
				setScorePRight,
				gameType,
				setGameType,
				nbPlayer,
				setNbPlayer,
				maxPlayer,
				setMaxPlayer,
				playerReady,
				setPlayerReady,
				gameState,
				setGameState,
				tournamentIsReady,
				setTournamentIsReady,
				startMatch,
				startTournament,
				addClientLocal,
				playerIsReady1,
				setPlayerIsReady1,
				playerIsReady2,
				setPlayerIsReady2,
				nextMatch,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export function getGame() {
	return useContext(GameContext);
}