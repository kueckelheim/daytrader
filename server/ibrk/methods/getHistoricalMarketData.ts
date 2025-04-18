import { BarSizeSetting, Contract } from '@stoqey/ib';
import { DataPoint } from '../../../src/lib/types/types';
import client from '../client';

export default async (contract: Contract) => {
	console.log('fetching historical market data for contract: ', contract);
	const response = await client.getHistoricalData(
		contract,
		undefined,
		'3 D',
		BarSizeSetting.MINUTES_ONE,
		'TRADES',
		false,
		2
	);
	console.log('alsdkj', response);

	const formatted = response.map((item) => ({
		x: item.time ? parseInt(item.time) * 1000 : undefined,
		o: item.open,
		h: item.high,
		l: item.low,
		c: item.close,
		v: item.volume
	})) as DataPoint[];

	return formatted;
};
