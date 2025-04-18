type DataPoint = {
	x: number; // timestamp
	h: number; // high price
	l: number; // low price
	c: number; // close price
	v: number; // volume
};

type VWAP = {
	x: number; // timestamp
	y: number; // VWAP value
};

export default (data: DataPoint[]): VWAP[] => {
	let cumulativeVolume = 0;
	let cumulativePriceVolume = 0;

	return data.map((point) => {
		const typicalPrice = (point.h + point.l + point.c) / 3;
		cumulativeVolume += point.v;
		cumulativePriceVolume += typicalPrice * point.v;

		const vwap = cumulativePriceVolume / cumulativeVolume;

		return { x: point.x, y: vwap };
	});
};
