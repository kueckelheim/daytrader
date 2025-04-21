import type { Account } from '$lib/types/types';
import type { OpenOrder, PnL, Position } from '@stoqey/ib';
import { writable } from 'svelte/store';

export const account = writable<Account>({
	availableFundsEUR: null,
	availableFundsUSD: null,
	accountId: null
});
export const positions = writable<Position[]>([]);
export const openOrders = writable<OpenOrder[]>([]);
export const pnl = writable<PnL>({
	dailyPnL: 0,
	realizedPnL: 0,
	unrealizedPnL: 0
});
