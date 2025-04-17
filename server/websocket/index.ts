import { Server } from 'http';
import { WebSocketServer } from 'ws';
import { handleWebSocket } from './handlers';

export function setupWebSocket(server: Server) {
	const wss = new WebSocketServer({ server });
	wss.on('connection', handleWebSocket);
}
