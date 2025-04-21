import { WebSocket } from 'ws';
import { AccountUpdateMessage, DailyPNLMessage, MessageType } from '../../../src/lib/types/types';
import { PnL } from '@stoqey/ib';
import { subscribeToDailyPNL } from '../../ibrk/methods/subscribeToDailyPNL';

const clients = new Set<WebSocket>();
let latestUpdate: PnL | null = null;

export function initPNLUpdates(accountId: string) {
	console.log('Initializing pnl...');
	subscribeToDailyPNL(
		(update) => {
			latestUpdate = update;

			clients.forEach((ws) => {
				if (ws.readyState === ws.OPEN) {
					const response: DailyPNLMessage = {
						type: MessageType.DAILY_PNL,
						data: update
					};
					ws.send(JSON.stringify(response));
				}
			});
		},
		(err) => {
			console.error('Daily PNL update error:', err);
		},
		accountId
	);
}

export function handlePNLSubscription(ws: WebSocket) {
	clients.add(ws);
	console.log('Client subscribed to pnl');

	if (latestUpdate && ws.readyState === ws.OPEN) {
		const response: DailyPNLMessage = {
			type: MessageType.DAILY_PNL,
			data: latestUpdate
		};
		ws.send(JSON.stringify(response));
	}

	ws.on('close', () => {
		clients.delete(ws);
		console.log('Client disconnected from pnl');
	});
}
