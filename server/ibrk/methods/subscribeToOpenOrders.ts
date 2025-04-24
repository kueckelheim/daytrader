/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenOrder, OpenOrdersUpdate, OrderStatus } from '@stoqey/ib';
import client from '../client';

const handleFilledOrder = (filledOrder: OpenOrder) => {
	console.log('order filled', filledOrder);
};

const updateHandler = (update: OpenOrdersUpdate, onUpdate: (update: any) => void) => {
	if (update.changed?.length) {
		onUpdate(update.changed.filter((order) => order.orderState.status !== OrderStatus.Cancelled));
		update.changed
			.filter((order) => order.orderState.status === OrderStatus.Filled)
			.forEach((order) => handleFilledOrder(order));
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
