import { WebSocket } from 'ws';
import { subscribeToOpenOrdersUpdates } from '../../ibrk/methods/subscribeToOpenOrders';
import { MessageType, OpenOrdersUpdateMessage } from '../../../src/lib/types/types';
import { OpenOrder } from '@stoqey/ib';

const subscribedClients = new Set<WebSocket>();
let latestUpdate: OpenOrder[] | null = null;

export function initOrderUpdates() {
	console.log('Initializing open order updates...');
	subscribeToOpenOrdersUpdates(
		(update) => {
			latestUpdate = update;
			console.log('Received open order update');
			subscribedClients.forEach((ws) => {
				if (ws.readyState === ws.OPEN) {
					const response: OpenOrdersUpdateMessage = {
						type: MessageType.OPEN_ORDERS_UPDATE,
						data: update
					};
					ws.send(JSON.stringify(response));
					console.log('Sent open order update to client');
				}
			});
		},
		(err) => {
			console.error('Open orders update error:', err);
		}
	);
}

export function handleOpenOrderUpdate(ws: WebSocket) {
	subscribedClients.add(ws);
	console.log('Client subscribed to open order updates');

	if (latestUpdate && ws.readyState === ws.OPEN) {
		const response: OpenOrdersUpdateMessage = {
			type: MessageType.OPEN_ORDERS_UPDATE,
			data: latestUpdate
		};
		ws.send(JSON.stringify(response));
	}

	ws.on('close', () => {
		subscribedClients.delete(ws);
		console.log('Client disconnected from open order updates');
	});
}

export const handleUnsubcribeOpenOrders = (ws: WebSocket) => {
	subscribedClients.delete(ws);
	console.log('Client unsubscribed from open order updates');
};
