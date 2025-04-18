import type { Chart } from 'chart.js';

export default (target: number | undefined, chart: Chart) => {
	if (target) {
		const line = {
			type: 'line',
			yMin: target,
			yMax: target,
			yScaleID: 'y2',
			borderColor: 'green',
			borderWidth: 2
		};
		chart.options.plugins.annotation.annotations['target'] = line;
	} else if (chart.options.plugins?.annotation?.annotations.target) {
		delete chart.options.plugins?.annotation?.annotations?.target;
	}
	chart?.update();
};
