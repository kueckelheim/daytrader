import { Request, Response } from 'express';
import { cancel, place } from '../ibrk/methods/order';

export const placeOrder = async (req: Request, res: Response): Promise<Response> => {
	try {
		const { limitPrice, nShares, conId, accountId, exchange, orderType } = req.body;

		if (
			(orderType === 'LMT' && !limitPrice) ||
			!nShares ||
			!conId ||
			!accountId ||
			!exchange ||
			!orderType
		) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		console.log('[order] received:', {
			limitPrice,
			nShares,
			conId,
			accountId,
			exchange,
			orderType
		});

		const orderId = await place({ limitPrice, nShares, conId, accountId, exchange, orderType });

		return res.status(200).json({ orderId });
	} catch (err) {
		console.error('[order] error:', err);
		return res.status(500).json({ error: 'Order placement failed' });
	}
};

export const cancelOrder = async (req: Request, res: Response): Promise<Response> => {
	try {
		const orderId = req.query.orderId as string;

		if (!orderId) {
			return res.status(400).json({ error: 'Missing orderId' });
		}

		await cancel(orderId);

		return res.status(200).json();
	} catch (err) {
		console.error('[order] error:', err);
		return res.status(500).json({ error: 'Order cancelling failed' });
	}
};
