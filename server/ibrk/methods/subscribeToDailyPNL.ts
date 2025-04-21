/* eslint-disable @typescript-eslint/no-explicit-any */
import client from '../client';

export async function subscribeToDailyPNL(
	onUpdate: (update: any) => void,
	onError: (err: any) => void,
	accountId: string
) {
	try {
		console.log('subscriping to daily pnl');

		// Subscribe to account updates from IBKR
		const obs = client.getPnL(accountId);

		obs.subscribe({
			next: (update) => {
				onUpdate(update);
			},
			complete: () => {
				console.log('IBKR pnl subscription completed.');
			},
			error: (err) => {
				console.error('IBKR daily pnl subscription error:', err);
				onError(err);
			}
		});
	} catch (err) {
		console.error('Failed to fetch pnl:', err);
		onError(err);
	}
}
