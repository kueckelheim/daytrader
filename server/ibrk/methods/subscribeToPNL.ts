/* eslint-disable @typescript-eslint/no-explicit-any */
import client from '../client';

export default async (
	onUpdate: (update: any) => void,
	onError: (err: any) => void,
	conId: number,
	accountId: string
): Promise<() => void> => {
	try {
		console.log(`Subscribing to pnl updates for ${conId}`);

		const obs = client.getPnLSingle(accountId, '', conId);
		const subscription = obs.subscribe({
			next: (update) => {
				onUpdate(update);
			},
			complete: () => {
				console.log('IBKR PNL subscription completed.');
			},
			error: (err) => {
				console.error('IBKR PNL subscription error:', err);
				onError(err);
			}
		});

		// Return the unsubscribe function for later use
		return () => {
			subscription.unsubscribe();
			console.log(`Unsubscribed from PNL for ${conId}`);
		};
	} catch (err) {
		console.error(`Failed to subscribe to PNL for: ${conId}`, err);
		onError(err);
		throw err; // Ensure to propagate the error
	}
};
