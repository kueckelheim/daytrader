import type { Chart } from 'chart.js';

export default (newData: { x: number; y: number }[], chart: Chart) => {
	if (chart) {
		const signalLineIndex = chart.data.datasets.findIndex((ds) => ds.label === 'Signal Line');

		// volume
		chart.data.datasets[signalLineIndex] = {
			...chart.data.datasets[signalLineIndex],
			data: newData
		};
		chart.update();
	}
};
