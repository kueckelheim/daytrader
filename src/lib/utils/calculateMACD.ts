import type { DataPoint } from '$lib/types/types';
import calculateEma from './calculateEma';

export default (data: DataPoint[]) => {
	if (data.length < 26) {
		throw new Error('Data length must be at least 26 to calculate MACD.');
	}

	const filteredData = data.filter((point) => point.c !== null && point.c !== undefined);

	// Calculate EMAs
	const ema12 = calculateEma(filteredData, 12);
	const ema26 = calculateEma(filteredData, 26);

	const alignedEma12 = ema12.slice(ema12.length - ema26.length);

	// Compute MACD Line
	const macdLine = alignedEma12.map((point, index) => ({
		x: point.x,
		y: point.y - ema26[index].y
	}));

	// Compute Signal Line (9-period EMA of MACD Line)
	const signalLine = calculateEma(
		macdLine.map(({ x, y }) => ({ x, c: y })),
		9
	);

	return { macdLine, signalLine };
};
