import type { Chart } from 'chart.js';

export default (newData: { x: number; y: number }[], chart: Chart) => {
	if (chart) {
		const macdIndex = chart.data.datasets.findIndex((ds) => ds.label === 'MACD');

		// volume
		chart.data.datasets[macdIndex] = {
			...chart.data.datasets[macdIndex],
			data: newData
		};
		chart.update();
	}
};
