import { WebSocket } from 'ws';
import { subscribeToAccountUpdates } from '../../ibrk/methods/subscribeToAccountUpdates';
import { Account, AccountUpdateMessage, MessageType } from '../../../src/lib/types/types';

const accountSubscriptionClients = new Set<WebSocket>();
let latestAccountUpdate: Account | null = null;

export function initAccountUpdates() {
	console.log('Initializing account updates...');
	subscribeToAccountUpdates(
		(update) => {
			console.log('Received account update:', update);
			latestAccountUpdate = update;

			accountSubscriptionClients.forEach((ws) => {
				if (ws.readyState === ws.OPEN) {
					const response: AccountUpdateMessage = {
						type: MessageType.ACCOUNT_UPDATE,
						data: update
					};
					ws.send(JSON.stringify(response));
					console.log('Sent account update to client');
				}
			});
		},
		(err) => {
			console.error('Account update error:', err);
		}
	);
}

export function handleAccountSubscription(ws: WebSocket) {
	accountSubscriptionClients.add(ws);
	console.log('Client subscribed to account updates');

	if (latestAccountUpdate && ws.readyState === ws.OPEN) {
		const response: AccountUpdateMessage = {
			type: MessageType.ACCOUNT_UPDATE,
			data: latestAccountUpdate
		};
		ws.send(JSON.stringify(response));
	}

	ws.on('close', () => {
		accountSubscriptionClients.delete(ws);
		console.log('Client disconnected from account updates');
	});
}
