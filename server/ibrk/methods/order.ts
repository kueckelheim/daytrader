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
		transmit: true
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
