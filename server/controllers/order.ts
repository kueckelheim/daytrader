import { Request, Response } from 'express';
import { cancel, place, sell } from '../ibrk/methods/order';

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

export const sellPosition = async (req: Request, res: Response): Promise<Response> => {
	try {
		const { nShares, conId, limitPrice, accountId, exchange, orderType } = req.body;

		if (
			!nShares ||
			!conId ||
			!accountId ||
			!exchange ||
			!orderType ||
			(orderType === 'LMT' && !limitPrice)
		) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		const orderId = await sell({ nShares, conId, accountId, exchange, orderType, limitPrice });

		return res.status(200).json({ orderId });
	} catch (err) {
		console.error('[order] error:', err);
		return res.status(400).json({ error: 'Invalid request body' });
	}
};
