import type { DataPoint } from '$lib/types/types';

export default (data: DataPoint[], period: number): { x: number; y: number }[] | undefined => {
	if (data.length < period) {
		return undefined;
	}

	const filteredData = data.filter((point) => point.c !== null && point.c !== undefined);

	const emaValues: { x: number; y: number }[] = [];
	const multiplier = 2 / (period + 1);

	// Calculate the first SMA (Simple Moving Average) for initialization
	const firstEMA = filteredData.slice(0, period).reduce((acc, value) => acc + value.c, 0) / period;
	emaValues.push({ x: filteredData[period - 1].x, y: firstEMA });

	// Loop through the data and calculate the subsequent EMAs
	for (let i = period; i < filteredData.length; i++) {
		const previousEMA = emaValues[emaValues.length - 1].y;
		const currentPrice = filteredData[i].c;

		// Calculate the new EMA value
		const ema = (currentPrice - previousEMA) * multiplier + previousEMA;
		emaValues.push({ x: filteredData[i].x, y: ema });
	}

	return emaValues;
};
