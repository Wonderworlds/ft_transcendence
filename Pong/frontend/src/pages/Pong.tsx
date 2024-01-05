import React, { useRef, useEffect, useState } from 'react';
import { getSocket } from '../context/WebsocketContext.tsx';
import { eventGame } from '../utils/types.tsx';

interface roomProps {
  room: string;
}

const Pong: React.FC<roomProps> = ({ room }) => {
  const socket = getSocket().socket;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playerPositions, setPlayerPositions] = useState<{ p1: number; p2: number }>({ p1: 0, p2: 0 });
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number }>({ x: 400, y: 300 });  

  useEffect(() => {
    socket.on('updateGame', (res) => {
      console.log(res);
    });

	socket.on('updatePos', (position) => {
		  console.log('Positions reçues du serveur :', position);
		  setPlayerPositions(position);
	});

	socket.on('updateBall', (position) => {
		 console.log('Positions reçues du serveur :', position);
		 setBallPosition(position);
	});

    return () => {
      socket.off('updateGame');
    };
  }, []);

  function sendInput(input: eventGame) {
    socket.emit('input', { room: room, event: input });
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          sendInput(eventGame.ARROW_UP);
          break;
        case 'ArrowDown':
          sendInput(eventGame.ARROW_DOWN);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, false);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [room, sendInput]);

  useEffect(() => {
	const canvas = canvasRef.current;
	if (!canvas) return;

	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = 'white';
	ctx.fillRect(10, playerPositions.p1, 10, 100);

	ctx.fillStyle = 'white';
	ctx.fillRect(780, playerPositions.p2, 10, 100);

	ctx.fillStyle = 'white';
	ctx.fillRect(ballPosition.x, ballPosition.y, 10, 10);

  }, [playerPositions]);

  return (
    <div className="PONG TITLE">
      <h1>PONG GAME</h1>
	        <p>Position du joueur 1 : {playerPositions.p1}</p>
      <p>Position du joueur 2 : {playerPositions.p2}</p>
      <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid #000' }} />
    </div>
  );
};

export default Pong;

//import React from 'react';
//import { getSocket } from '../context/WebsocketContext.tsx';
//import { eventGame } from '../utils/types.tsx';
//
//interface roomProps {
//	room: string;
//}
//
//const Pong: React.FC<roomProps> = ({ room }) => {
//	const socket = getSocket().socket;
//
//	React.useEffect(() => {
//		socket.on('updateGame', (res) => {
//			console.log(res);
//		});
//		return () => {
//			socket.off('updateGame');
//		};
//	}, []);
//
//	function sendInput(input: eventGame) {
//		socket.emit('input', { room: room, event: input });
//	}
//
//	window.addEventListener('keydown', (e) => {
//		switch (e.key) {
//			case 'ArrowUp':
//				sendInput(eventGame.ARROW_UP);
//				break;
//			case 'ArrowDown':
//				sendInput(eventGame.ARROW_DOWN);
//				break;
//			case 'w':
//				sendInput(eventGame.W_KEY);
//				break;
//			case 's':
//				sendInput(eventGame.S_KEY);
//				break;
//			default:
//				break;
//		}
//	}, false);
//
//	return (
//		<div className="PONG TITLE">
//			<h1>PONG GAME</h1>
//		</div>
//	);
//};
//
//export default Pong;
