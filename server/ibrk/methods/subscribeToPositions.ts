/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountPositionsUpdate } from '@stoqey/ib';
import client from '../client';

const updateHandler = (
	update: AccountPositionsUpdate,
	onUpdate: (update: any) => void,
	accountId: string
) => {
	if (update.all?.get(accountId)?.length) {
		onUpdate(update.all?.get(accountId)!.filter((pos) => pos.pos));
	}
};

export async function subscribeToPositionsUpdates(
	onUpdate: (update: any) => void,
	onError: (err: any) => void,
	accountId: string
) {
	try {
		console.log('subscriping to position updates');

		// Subscribe to account updates from IBKR
		const obs = client.getPositions();

		obs.subscribe({
			next: (update) => {
				updateHandler(update, onUpdate, accountId);
			},
			complete: () => {
				console.log('IBKR position updates subscription completed.');
			},
			error: (err) => {
				console.error('IBKR subscription error:', err);
				onError(err);
			}
		});
	} catch (err) {
		console.error('Failed to subscribe to position updates:', err);
		onError(err);
	}
}
