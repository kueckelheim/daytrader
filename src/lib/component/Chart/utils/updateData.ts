import type { DataPoint } from '$lib/types/types';
import type { Chart } from 'chart.js';

export default (newData: DataPoint[], chart: Chart | undefined) => {
	if (chart) {
		const volumeChartIndex = chart.data.datasets.findIndex((ds) => ds.label === 'Volume');
		const candleChartIndex = chart.data.datasets.findIndex((ds) => ds.label === 'candlesticks');

		// volume
		chart.data.datasets[volumeChartIndex] = {
			...chart.data.datasets[volumeChartIndex],
			data: newData.map(({ x, v }) => ({ x, y: v })),
			backgroundColor: newData.map((point, index) => {
				// Get current price and the previous price (if it exists)
				const currentPrice = point.c; // Current closing price
				const prevPrice = index > 0 ? newData[index - 1].c : currentPrice; // Previous closing price or current if no previous

				// Dynamically set the background color based on price movement
				const color = currentPrice > prevPrice ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.6)';

				return color; // Set the background color based on price movement
			})
		};

		chart.data.datasets[candleChartIndex] = {
			...chart.data.datasets[candleChartIndex],
			data: newData
		};

		// Calculate new y2 axis limits based on the new data
		const y2Values = newData.map(({ c }) => c).filter((value) => !!value);
		const y2Min = Math.min(...y2Values);
		const y2Max = Math.max(...y2Values);
		const y2Padding = (y2Max - y2Min) * 0.1;
		const y2MinWithPadding = y2Min - y2Padding;
		const y2MaxWithPadding = y2Max + y2Padding;

		// Update y2 axis limits
		if (chart.options.scales.y2) {
			chart.options.scales.y2.min = y2MinWithPadding;
			chart.options.scales.y2.max = y2MaxWithPadding;
		}

		chart.update();
	}
};
