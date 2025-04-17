import { WebSocket } from 'ws';
import { subscribeToScanner } from '../../ibrk/methods/scan';
import { MessageType, ScanMatch, ScanUpdateMessage } from '../../../src/lib/types/types';

const subscribedClients = new Set<WebSocket>();
let latestUpdate: ScanMatch[] | null = null;

export function initScanner() {
	console.log('Initializing scan updates...');
	subscribeToScanner(
		(update) => {
			latestUpdate = update;
			console.log('Received scan update');
			subscribedClients.forEach((ws) => {
				if (ws.readyState === ws.OPEN) {
					const response: ScanUpdateMessage = {
						type: MessageType.SCAN_UPDATE,
						data: update
					};
					ws.send(JSON.stringify(response));
					console.log('Sent scan update to client');
				}
			});
		},
		(err) => {
			console.error('Scan update error:', err);
		}
	);
}

export function handleScanSubscription(ws: WebSocket) {
	subscribedClients.add(ws);
	console.log('Client subscribed to scan updates');

	if (latestUpdate && ws.readyState === ws.OPEN) {
		const response: ScanUpdateMessage = {
			type: MessageType.SCAN_UPDATE,
			data: latestUpdate
		};
		ws.send(JSON.stringify(response));
	}

	ws.on('close', () => {
		subscribedClients.delete(ws);
		console.log('Client disconnected from scan updates');
	});
}
