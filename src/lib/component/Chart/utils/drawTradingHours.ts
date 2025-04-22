import type { DataPoint } from '$lib/types/types';
import type { Chart } from 'chart.js';

export default (tradingHours: { x: number; label: string }[], chart: Chart, data: DataPoint[]) => {
	if (chart) {
		const annotations = chart.options.plugins?.annotation?.annotations;

		if (!annotations) return;

		tradingHours.forEach((hour, i) => {
			const key = `tradingHour${i}`;
			if (hour.x >= data[0].x && hour.x <= data[data.length - 1].x) {
				annotations[key] = {
					type: 'line',
					scaleID: 'x',
					yAxisID: 'y2',
					borderColor: '#fff',
					borderDash: [2, 2],
					borderWidth: 2,
					value: hour.x,
					drawTime: 'beforeDatasetsDraw',
					label: {
						display: true,
						content: hour.label,
						position: 'start',
						color: '#fff',
						font: { size: 10 }
					}
				};
			} else {
				// Remove the annotation if it exists
				if (annotations[key]) {
					delete annotations[key];
				}
			}
		});

		chart.update();
	}
};
