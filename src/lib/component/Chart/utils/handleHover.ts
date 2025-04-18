import type { Chart, ChartEvent } from 'chart.js';

export default (chart: Chart | undefined, event: ChartEvent) => {
	if (chart) {
		const yScale = chart.scales.y2;
		let yValue = yScale.getValueForPixel(event.y);
		if (yValue !== null) {
			const minY = yScale.min;
			const maxY = yScale.max;
			yValue = Math.max(minY, Math.min(maxY, yValue));

			chart.options.plugins.annotation.annotations.hoverLine.yMin = yValue;
			chart.options.plugins.annotation.annotations.hoverLine.yMax = yValue;
			chart.options.plugins.annotation.annotations.hoverLine.display = true;
			chart.update();
		}
	}
};
