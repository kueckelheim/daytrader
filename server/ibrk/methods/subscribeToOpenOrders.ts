/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenOrdersUpdate, OrderStatus } from '@stoqey/ib';
import client from '../client';

const updateHandler = (update: OpenOrdersUpdate, onUpdate: (update: any) => void) => {
	if (update.all?.length) {
		onUpdate(update.all.filter((order) => order.orderState.status !== OrderStatus.Cancelled));
	}
};

export async function subscribeToOpenOrdersUpdates(
	onUpdate: (update: any) => void,
	onError: (err: any) => void
) {
	try {
		console.log('subscriping to open order updates');

		// Subscribe to account updates from IBKR
		const obs = client.getAutoOpenOrders(true);

		obs.subscribe({
			next: (update) => {
				updateHandler(update, onUpdate);
			},
			complete: () => {
				console.log('IBKR order subscription completed.');
			},
			error: (err) => {
				console.error('IBKR subscription error:', err);
				onError(err);
			}
		});
	} catch (err) {
		console.error('Failed to subscribe to open orders:', err);
		onError(err);
	}
}
