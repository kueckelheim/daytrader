import type { Chart } from 'chart.js';

export default (newData: { x: number; y: number }[], period: number, chart: Chart | undefined) => {
	if (chart) {
		const emaIndex = chart.data.datasets.findIndex((ds) => ds.label === `EMA ${period}`);

		// volume
		chart.data.datasets[emaIndex] = {
			...chart.data.datasets[emaIndex],
			data: newData
		};
		chart.update();
	}
};
