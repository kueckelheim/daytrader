import { Server } from 'http';
import { WebSocketServer } from 'ws';
import { handleAccountSubscription, initAccountUpdates } from './subscriptions/accountUpdates';
import { MessageType, WebSocketMessage } from '../../src/lib/types/types';

export function setupWebSocket(server: Server) {
	const wss = new WebSocketServer({ server });

	initAccountUpdates();

	wss.on('connection', (ws) => {
		ws.on('message', (msg) => {
			const message: WebSocketMessage = JSON.parse(msg.toString());

			switch (message.type) {
				case MessageType.SUBSCRIBE_ACCOUNT:
					handleAccountSubscription(ws);
					break;
				default:
					console.log('Unknown message type:', message.type);
					ws.send(JSON.stringify(`Echo`));
			}
		});
	});
}
