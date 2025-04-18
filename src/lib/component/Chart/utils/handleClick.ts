import type { Chart, ChartEvent } from 'chart.js';

export default (chart: Chart | undefined, event: ChartEvent, onClick?: (y: number) => void) => {
	if (chart) {
		const yScale = chart.scales.y2;
		let yValue = yScale.getValueForPixel(event.y);

		if (yValue !== null) {
			// Clamp yValue to stay within the chart's Y-axis range
			const minY = yScale.min;
			const maxY = yScale.max;
			yValue = Math.max(minY, Math.min(maxY, yValue!));
			if (onClick) onClick(yValue);
		}
	}
};
