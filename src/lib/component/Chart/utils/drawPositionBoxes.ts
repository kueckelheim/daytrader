import type { DataPoint, Position } from '$lib/types/types';
import type { Chart } from 'chart.js';

export default (data: DataPoint[], positions: Position[], chart: Chart) => {
	if (chart) {
		positions.forEach((position) => {
			const annotationKey = `openPosition-${position.entryDate}`;

			// Process the position if:
			// - The entry date is after or equal to the first data point OR
			// - No exit date exists OR
			// - The exit date (if it exists) is in between the data time range
			if (
				position.entryDate >= data[0].x ||
				!position.exitDate ||
				(position.exitDate &&
					position.exitDate >= data[0].x &&
					position.exitDate <= data[data.length - 1].x)
			) {
				const box = {
					type: 'box',
					xMin: position.entryDate,
					xMax: position.exitDate || undefined,
					yScaleID: 'y2',
					yMin: position.entryPoint, // Set the lower bound
					yMax: position.entryPoint, // Set the upper bound
					borderColor: position.exitDate
						? position.exitPoint! > position.entryPoint
							? 'green'
							: 'red'
						: 'lightblue',
					borderWidth: 1.5,
					borderDash: [3, 2],
					backgroundColor: 'transparent'
				};
				chart.options.plugins.annotation.annotations[annotationKey] = box;
			} else {
				// Remove the annotation if it exists
				if (chart.options.plugins.annotation.annotations[annotationKey]) {
					delete chart.options.plugins.annotation.annotations[annotationKey];
				}
			}
		});
		chart.update();
	}
};
