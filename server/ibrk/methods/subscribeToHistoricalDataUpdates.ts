/* eslint-disable @typescript-eslint/no-explicit-any */
import { BarSizeSetting, Contract, MarketDataType, WhatToShow } from '@stoqey/ib';
import client from '../client';

export default async (
	onUpdate: (update: any) => void,
	onError: (err: any) => void,
	contract: Contract
): Promise<() => void> => {
	try {
		console.log(`Subscribing to marketdata updates for ${contract.symbol}`);

		client.setMarketDataType(MarketDataType.REALTIME);

		const obs = client.getHistoricalDataUpdates(
			contract,
			BarSizeSetting.MINUTES_ONE,
			WhatToShow.TRADES,
			2
		);
		const subscription = obs.subscribe({
			next: (update) => {
				onUpdate(update);
			},
			complete: () => {
				console.log('IBKR historical data update subscription completed.');
			},
			error: (err) => {
				console.error('IBKR historical data updates subscription error:', err);
				onError(err);
			}
		});

		// Return the unsubscribe function for later use
		return () => {
			subscription.unsubscribe();
			console.log(`Unsubscribed from market data updates for ${contract.symbol}`);
		};
	} catch (err) {
		console.error('Failed to subscribe to historical data updates:', err);
		onError(err);
		throw err; // Ensure to propagate the error
	}
};
