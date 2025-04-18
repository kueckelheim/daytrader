import { WebSocket } from 'ws';
import { LatestBarMessage, MessageType } from '../../../src/lib/types/types';
import subscribeToHistoricalDataUpdates from '../../ibrk/methods/subscribeToHistoricalDataUpdates';
import { Contract } from '@stoqey/ib';

export async function handleHistoricalMarketDataUpdateSubscription(
	ws: WebSocket,
	contract: Contract
) {
	console.log(`Client subscribed to historical market data updates for ${contract.symbol}`);

	// Variable to hold the unsubscribe function
	let unsubscribe: () => void;

	try {
		// Subscribe to historical data updates and store the unsubscribe function
		unsubscribe = await subscribeToHistoricalDataUpdates(
			(update) => {
				console.log(`Received latest bar for ${contract.symbol}`);
				const response: LatestBarMessage = {
					type: MessageType.LASTEST_BAR,
					data: update
				};
				ws.send(JSON.stringify(response));
				console.log(`Sent latest bar for ${contract.symbol}`);
			},
			() => {},
			contract
		);

		// Handle WebSocket close event to cancel subscription
		ws.on('close', () => {
			console.log(`WebSocket closed for ${contract.symbol}. Unsubscribing...`);

			// Call the unsubscribe function to stop the subscription
			if (unsubscribe) {
				unsubscribe();
			}
		});
	} catch (err) {
		console.error('Error subscribing to historical data updates:', err);
	}
}
