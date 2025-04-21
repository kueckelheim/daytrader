import { Request, Response } from 'express';
import getContractDetails from '../ibrk/methods/getContractDetails';
import getHistoricalMarketData from '../ibrk/methods/getHistoricalMarketData';

export const getMarketData = async (req: Request, res: Response): Promise<Response> => {
	try {
		console.log('client requested historical market data');
		const { conId } = req.query as { conId: string };

		if (!conId) {
			return res.status(400);
		}

		const contractDetails = await getContractDetails(parseInt(conId));

		const data = await getHistoricalMarketData(contractDetails[0].contract);

		return res.json({ contractDetails: contractDetails[0], data });
	} catch (err: unknown) {
		console.error('[controllers - marketData] - error:\n', err);
		return res.status(500).json({ error: 'Failed to fetch market data.' });
	}
};
