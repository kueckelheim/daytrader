/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountUpdatesUpdate } from '@stoqey/ib';
import { Account } from '../../../src/lib/types/types';
import client from '../client';

const account: Account = {
	availableFundsEUR: null,
	accountId: null,
	availableFundsUSD: null
};

const getCashBalance = (value: any, currency: 'EUR' | 'USD') => {
	return value?.changed?.value?.get(account.accountId)?.get('CashBalance')?.get(currency)?.value;
};

const updateHandler = (value: AccountUpdatesUpdate, onUpdate: (update: any) => void) => {
	const oldValues = { ...account };

	const newAvailableFundsEUR = getCashBalance(value, 'EUR');
	const newAvailableFundsUSD = getCashBalance(value, 'USD');

	// Only update if the value has changed
	if (newAvailableFundsEUR) {
		account.availableFundsEUR = parseFloat(newAvailableFundsEUR);
	}

	if (newAvailableFundsUSD) {
		account.availableFundsUSD = parseFloat(newAvailableFundsUSD);
	}

	// If any value changed, send the update
	if (
		account.availableFundsEUR !== oldValues.availableFundsEUR ||
		account.availableFundsUSD !== oldValues.availableFundsUSD
	) {
		onUpdate(account);
	}
};

export async function subscribeToAccountUpdates(
	onUpdate: (update: any) => void,
	onError: (err: any) => void,
	accountId: string
) {
	try {
		console.log('subscriping to account updates');
		account.accountId = accountId;

		// Subscribe to account updates from IBKR
		const accountUpdatesObservable = client.getAccountUpdates();

		accountUpdatesObservable.subscribe({
			next: (update) => {
				updateHandler(update, onUpdate);
			},
			complete: () => {
				console.log('IBKR account update subscription completed.');
			},
			error: (err) => {
				console.error('IBKR subscription error:', err);
				onError(err);
			}
		});
	} catch (err) {
		console.error('Failed to fetch managed accounts:', err);
		onError(err);
	}
}
