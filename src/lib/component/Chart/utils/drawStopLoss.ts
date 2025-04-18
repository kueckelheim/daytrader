import type { Chart } from 'chart.js';

export default (stopLoss: number | undefined, chart: Chart) => {
	if (stopLoss) {
		const line = {
			type: 'line',
			yMin: stopLoss,
			yMax: stopLoss,
			yScaleID: 'y2',
			borderColor: 'rgb(255, 99, 132)',
			borderWidth: 2
		};
		chart.options.plugins.annotation.annotations['stopLoss'] = line;
	} else if (chart.options.plugins?.annotation?.annotations?.stopLoss) {
		// remove stop loss
		delete chart.options.plugins?.annotation?.annotations?.stopLoss;
	}
	chart.update();
};
