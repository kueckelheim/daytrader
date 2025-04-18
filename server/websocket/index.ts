import { Server } from 'http';
import { WebSocketServer } from 'ws';
import { handleAccountSubscription, initAccountUpdates } from './subscriptions/accountUpdates';
import { MessageType, WebSocketMessage } from '../../src/lib/types/types';
import { handleScanSubscription, initScanner } from './subscriptions/scanner';
import { handleHistoricalMarketDataUpdateSubscription } from './subscriptions/historicalMarketDataUpdate';

export function setupWebSocket(server: Server) {
	const wss = new WebSocketServer({ server });

	initAccountUpdates();
	initScanner();

	wss.on('connection', (ws) => {
		ws.on('message', (msg) => {
			const message: WebSocketMessage = JSON.parse(msg.toString());

			switch (message.type) {
				case MessageType.SUBSCRIBE_ACCOUNT:
					handleAccountSubscription(ws);
					break;
				case MessageType.SUBSCRIBE_SCAN:
					handleScanSubscription(ws);
					break;
				case MessageType.SUBSCRIBE_LASTEST_BAR:
					handleHistoricalMarketDataUpdateSubscription(ws, message.data);
					break;
				default:
					console.log('Unknown message type:', message.type);
					ws.send(JSON.stringify(`Echo`));
			}
		});
	});
}
