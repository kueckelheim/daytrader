import { WebSocket } from 'ws';
import { MessageType, PNLUpdate } from '../../../src/lib/types/types';
import subscribeToPNL from '../../ibrk/methods/subscribeToPNL';

const activePNLSubscriptions = new Map<string, () => void>();

export async function handlePNLPositionSubscription(
	ws: WebSocket,
	conId: number,
	accountId: string
) {
	const key = `${ws}_${conId}_${accountId}`;
	console.log(`Client subscribed to pnl for ${conId}`);

	try {
		const unsubscribe = await subscribeToPNL(
			(update) => {
				const response: PNLUpdate = {
					type: MessageType.PNL_UPDATE_POSITION,
					data: update
				};
				ws.send(JSON.stringify(response));
			},
			() => {},
			conId,
			accountId
		);

		activePNLSubscriptions.set(key, unsubscribe);

		ws.on('close', () => {
			console.log(`WebSocket closed for ${conId}. Unsubscribing...`);
			const fn = activePNLSubscriptions.get(key);
			if (fn) {
				fn();
				activePNLSubscriptions.delete(key);
			}
		});
	} catch (err) {
		console.error('Error subscribing to pnl:', err);
	}
}

export async function handlePNLPositionUnSubscribe(
	ws: WebSocket,
	conId: number,
	accountId: string
) {
	const key = `${ws}_${conId}_${accountId}`;
	const unsubscribe = activePNLSubscriptions.get(key);

	if (unsubscribe) {
		unsubscribe();
		activePNLSubscriptions.delete(key);
		console.log(`Manually unsubscribed from pnl for ${conId}`);
	}
}
