import { Server } from 'http';
import { WebSocketServer } from 'ws';
import { handleAccountSubscription, initAccountUpdates } from './subscriptions/accountUpdates';
import { MessageType, WebSocketMessage } from '../../src/lib/types/types';
import { handleScanSubscription, initScanner } from './subscriptions/scanner';
import { handleHistoricalMarketDataUpdateSubscription } from './subscriptions/historicalMarketDataUpdate';
import {
	handleOpenOrderUpdate,
	handleUnsubcribeOpenOrders,
	initOrderUpdates
} from './subscriptions/ordersUpdate';
import {
	handleSubscribePositionsUpdate,
	handleUnsubcribePositions,
	initPositionsUpdates
} from './subscriptions/positionsUpdate';
import {
	handlePNLPositionSubscription,
	handlePNLPositionUnSubscribe
} from './subscriptions/pnlPosition';
import client from '../ibrk/client';

export async function setupWebSocket(server: Server) {
	const wss = new WebSocketServer({ server });

	const accounts = await client.getManagedAccounts();
	const accountId = accounts[0];

	initAccountUpdates(accountId);
	initScanner();
	initOrderUpdates();
	initPositionsUpdates(accountId);

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
				case MessageType.SUBSCRIBE_OPEN_ORDERS:
					handleOpenOrderUpdate(ws);
					break;
				case MessageType.UNSUBSCRIBE_OPEN_ORDERS:
					handleUnsubcribeOpenOrders(ws);
					break;
				case MessageType.SUBSRIBE_POSITIONS_UPDATE:
					handleSubscribePositionsUpdate(ws);
					break;
				case MessageType.UNSUBSRIBE_POSITIONS_UPDATE:
					handleUnsubcribePositions(ws);
					break;
				case MessageType.SUBSCRIBE_LASTEST_BAR:
					handleHistoricalMarketDataUpdateSubscription(ws, message.data);
					break;
				case MessageType.SUBSCRIBE_PNL_POSITION:
					handlePNLPositionSubscription(ws, message.data.conId, message.data.accountId);
					break;
				case MessageType.UNSUBSCRIBE_PNL_POSITION:
					handlePNLPositionUnSubscribe(ws, message.data.conId, message.data.accountId);
					break;
				default:
					console.log('Unknown message type:', message.type);
					ws.send(JSON.stringify(`Echo`));
			}
		});
	});
}
