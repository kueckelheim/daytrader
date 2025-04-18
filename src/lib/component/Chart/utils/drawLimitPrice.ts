import type { Chart } from 'chart.js';

export default (limitPrice: number | undefined, chart: Chart) => {
	if (limitPrice) {
		const line = {
			type: 'line',
			yMin: limitPrice,
			yMax: limitPrice,
			yScaleID: 'y2',
			borderColor: 'lightgreen',
			borderDash: [5, 5],
			borderWidth: 1
		};
		chart.options.plugins.annotation.annotations['limitPrice'] = line;
	} else if (chart.options.plugins?.annotation?.annotations?.limitPrice) {
		// remove stop loss
		delete chart.options.plugins?.annotation?.annotations?.limitPrice;
	}
	chart.update();
};
