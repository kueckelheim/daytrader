import { WebSocket } from 'ws';
import { MessageType, PositionsUpdateMessage } from '../../../src/lib/types/types';
import { Position } from '@stoqey/ib';
import { subscribeToPositionsUpdates } from '../../ibrk/methods/subscribeToPositions';

const subscribedClients = new Set<WebSocket>();
let latestUpdate: Position[] | null = null;

export function initPositionsUpdates(accountId: string) {
	console.log('Initializing positions updates...');

	subscribeToPositionsUpdates(
		(update) => {
			latestUpdate = update;
			console.log('Received positions update');
			subscribedClients.forEach((ws) => {
				if (ws.readyState === ws.OPEN) {
					const response: PositionsUpdateMessage = {
						type: MessageType.POSITIONS_UPDATE,
						data: update
					};
					ws.send(JSON.stringify(response));
					console.log('Sent positions update to client');
				}
			});
		},
		(err) => {
			console.error('Positions update error:', err);
		},
		accountId
	);
}

export function handleSubscribePositionsUpdate(ws: WebSocket) {
	subscribedClients.add(ws);
	console.log('Client subscribed to position updates');

	if (latestUpdate && ws.readyState === ws.OPEN) {
		const response: PositionsUpdateMessage = {
			type: MessageType.POSITIONS_UPDATE,
			data: latestUpdate
		};
		ws.send(JSON.stringify(response));
	}

	ws.on('close', () => {
		subscribedClients.delete(ws);
		console.log('Client disconnected from position updates');
	});
}

export const handleUnsubcribePositions = (ws: WebSocket) => {
	subscribedClients.delete(ws);
	console.log('Client unsubscribed from positions updates');
};
