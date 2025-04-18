import { Request, Response } from 'express';
import querySymbol from '../ibrk/methods/querySymbol';

export const search = async (req: Request, res: Response): Promise<Response> => {
	const query = req.query.query as string;

	if (!query || query.length < 2) {
		return res.status(400).json({ error: 'Query must be at least 2 characters.' });
	}

	try {
		const result = await querySymbol(query);
		return res.json(result);
	} catch (err: unknown) {
		console.error('[controllers - searchSymbol] - error:\n', err);
		return res.status(500).json({ error: 'Failed to fetch search results.' });
	}
};
