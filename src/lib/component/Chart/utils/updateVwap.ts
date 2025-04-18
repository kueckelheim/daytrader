import type { Chart } from 'chart.js';

export default (newData: { x: number; y: number }[], chart: Chart) => {
	if (chart) {
		const vwapIndex = chart.data.datasets.findIndex((ds) => ds.label === 'VWAP');

		// volume
		chart.data.datasets[vwapIndex] = {
			...chart.data.datasets[vwapIndex],
			data: newData
		};
		chart.update();
	}
};
