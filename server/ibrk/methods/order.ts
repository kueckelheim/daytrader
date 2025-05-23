import { Order, OrderAction, OrderType } from '@stoqey/ib';
import client from '../client';

export const place = async ({
	limitPrice,
	nShares,
	conId,
	accountId,
	exchange,
	orderType
}: {
	limitPrice: string | undefined;
	nShares: string;
	conId: number;
	accountId: string;
	exchange: string;
	orderType: OrderType;
}) => {
	const order: Order = {
		orderType,
		action: OrderAction.BUY,
		...(orderType === 'LMT'
			? {
					lmtPrice: parseFloat(limitPrice!)
				}
			: {}),
		totalQuantity: parseInt(nShares),
		account: accountId,
		clientId: 0,
		outsideRth: true,
		transmit: true,
		tif: 'GTD',
		/**
		 * The date and time until the order will be active.
		 * You must enter GTD as the time in force to use this string.
		 * The trade's "Good Till Date," format "YYYYMMDD hh:mm:ss (optional time zone)".
		 */
		goodTillDate:
			new Date(Date.now() + 10_000).toISOString().replace('T', ' ').slice(0, 19).replace(/-/g, '') +
			' UTC'
	};

	console.log('placing new order', order);
	const orderId = await client.placeNewOrder(
		{
			conId,
			exchange
		},
		order
	);

	return orderId;
};

export const cancel = async (orderId: string) => {
	console.log('cancel order', orderId);
	await client.cancelOrder(Number(orderId));
};

export const sell = async ({
	nShares,
	conId,
	limitPrice,
	accountId,
	exchange,
	orderType
}: {
	limitPrice: string | undefined;
	nShares: string;
	conId: number;
	accountId: string;
	exchange: string;
	orderType: OrderType;
}) => {
	const order: Order = {
		orderType,
		action: OrderAction.SELL,
		...(orderType === 'LMT' ? { lmtPrice: parseFloat(limitPrice!) } : {}),
		totalQuantity: parseInt(nShares),
		account: accountId,
		clientId: 0,
		transmit: true,
		outsideRth: true
	};

	console.log('placing new sell order', order);
	const orderId = await client.placeNewOrder({ conId, exchange }, order);
	return orderId;
};
