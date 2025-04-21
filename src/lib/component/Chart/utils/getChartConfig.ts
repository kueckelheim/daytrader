import type { DataPoint } from '$lib/types/types';
import type { Chart, ChartConfiguration, ChartEvent } from 'chart.js';

export interface ChartConfigOptions {
	data: DataPoint[];
	signalLine: { x: number; y: number }[] | undefined;
	ema9: { x: number; y: number }[] | undefined;
	ema20: { x: number; y: number }[] | undefined;
	ema200: { x: number; y: number }[] | undefined;
	vwap: { x: number; y: number }[] | undefined;
	macdLine: { x: number; y: number }[] | undefined;
	updateToolTipData: (data: undefined | DataPoint) => void;
	chart: Chart | undefined;
	onHover: (event: ChartEvent) => void;
	onClick: (event: ChartEvent) => void;
}

export const getChartConfig = ({
	data,
	signalLine,
	ema9,
	ema20,
	ema200,
	vwap,
	macdLine,
	updateToolTipData,
	onClick,
	onHover
}: ChartConfigOptions): ChartConfiguration => ({
	type: 'candlestick',
	data: {
		datasets: [
			{
				label: 'Volume',
				type: 'bar',
				data: data.map(({ x, v }) => ({ x, y: v })), // volume data
				backgroundColor: data.map((point, index) => {
					// Get current price and the previous price (if it exists)
					const currentPrice = point.c; // Current closing price
					const prevPrice = index > 0 ? data[index - 1].c : currentPrice; // Previous closing price or current if no previous

					// Dynamically set the background color based on price movement
					const color = currentPrice > prevPrice ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.6)';

					return color; // Set the background color based on price movement
				}),
				borderColor: 'transparent', // Remove borders for volume bars
				borderWidth: 0,
				yAxisID: 'y-volume' // Use a secondary y-axis for volume,
			},
			...(macdLine
				? [
						{
							yAxisID: 'y3',
							label: 'MACD',
							type: 'line',
							data: macdLine,
							borderColor: 'lightblue', // Set line color to gray
							borderWidth: 1, // Set line width (adjust as needed)
							fill: false, // Don't fill area under line
							pointRadius: 0, // Remove points
							tension: 0.1 // Optionally adjust the line smoothness
						}
					]
				: ([] as any)),
			...(signalLine
				? [
						{
							yAxisID: 'y3',
							label: 'Signal Line',
							type: 'line',
							data: signalLine,
							borderColor: 'tomato', // Set line color to gray
							borderWidth: 1, // Set line width (adjust as needed)
							fill: false, // Don't fill area under line
							pointRadius: 0, // Remove points
							tension: 0.1 // Optionally adjust the line smoothness
						}
					]
				: ([] as any)),
			{
				data: data,
				label: 'candlesticks',
				backgroundColors: {
					up: 'limegreen',
					down: 'red'
				},
				borderColors: {
					up: 'limegreen',
					down: 'red'
				},
				yAxisID: 'y2'
			},
			...(ema9
				? [
						{
							yAxisID: 'y2',
							label: 'EMA 9',
							type: 'line',
							data: ema9,
							borderColor: 'white', // Set line color to white
							borderWidth: 1.5, // Set line width (adjust as needed)
							borderDash: [3, 3], // Create a dotted line (3px dash, 3px space)
							fill: false, // Don't fill area under line
							pointRadius: 0, // Remove points
							tension: 0.1 // Optionally adjust the line smoothness
						}
					]
				: ([] as any)),
			...(ema20
				? [
						{
							yAxisID: 'y2',
							label: 'EMA 20',
							type: 'line',
							data: ema20,
							borderColor: 'white', // Set line color to white
							borderWidth: 1.5, // Set line width (adjust as needed)
							borderDash: [1.5, 1.5], // Create a dotted line (3px dash, 3px space)
							fill: false, // Don't fill area under line
							pointRadius: 0, // Remove points
							tension: 0.1 // Optionally adjust the line smoothness
						}
					]
				: ([] as any)),
			...(ema200
				? [
						{
							yAxisID: 'y2',
							label: 'EMA 200',
							type: 'line',
							data: ema200,
							borderColor: 'white', // Set line color to white
							borderWidth: 1, // Set line width (adjust as needed)
							fill: false, // Don't fill area under line
							pointRadius: 0, // Remove points
							tension: 0.1 // Optionally adjust the line smoothness
						}
					]
				: ([] as any)),
			...(vwap
				? [
						{
							yAxisID: 'y2',
							label: 'VWAP',
							type: 'line',
							data: vwap,
							borderColor: 'yellow', // Set line color to gray
							borderWidth: 1, // Set line width (adjust as needed)
							fill: false, // Don't fill area under line
							pointRadius: 0, // Remove points
							tension: 0.1 // Optionally adjust the line smoothness
						}
					]
				: ([] as any))
		]
	},
	options: {
		animation: false,
		responsive: true,
		maintainAspectRatio: true,
		plugins: {
			tooltip: {
				enabled: false, // Disable the default tooltip
				external: (context) => {
					if (!context.tooltip) {
						updateToolTipData(undefined);
						return;
					}

					const dataPoints = context.tooltip?.dataPoints;
					if (dataPoints?.length) {
						let values: any = {};
						dataPoints.forEach((ds) => {
							if (ds.dataset?.label === 'candlesticks') {
								values['h'] = ds.raw.h;
								values['o'] = ds?.raw?.o as number;
								values['c'] = ds?.raw?.c;
								values['l'] = ds?.raw?.l;
								values['x'] = ds?.raw?.x;
							}
							if (ds.dataset?.label === 'Volume') {
								values['v'] = ds.raw.y;
							}
						});
						updateToolTipData(values);
					}
				}
			},
			annotation: {
				annotations: {
					hoverLine: {
						type: 'line',
						yScaleID: 'y2',
						yMin: 0, // Will update dynamically
						yMax: 0, // Will update dynamically
						borderColor: 'lightgreen',
						borderWidth: 1,
						borderDash: [5, 5],
						display: false // Initially hidden
					}
				}
			},
			legend: {
				labels: {
					boxWidth: 0
				},
				position: 'bottom'
			}
		},
		onHover,
		onClick,
		scales: {
			x: {
				type: 'timeseries',
				time: {
					unit: 'minute',
					displayFormats: {
						minute: 'h:mm a',
						hour: 'h:mm a'
					}
				},
				ticks: {
					color: 'white'
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.2)' // Faint white grid
				}
			},
			// Secondary y-axis for volume (hidden)
			'y-volume': {
				position: 'left',
				display: false, // Hide the volume y-axis
				grid: {
					drawOnChartArea: true // No grid lines for the volume axis
				},
				ticks: {
					color: 'white'
				},
				beginAtZero: true,
				stack: 'demo',
				stackWeight: 1
			},
			y3: {
				display: false,
				ticks: {
					color: 'white'
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.2)' // Faint white grid
				},
				stack: 'demo',
				stackWeight: 1
			},
			y2: {
				ticks: {
					color: 'white'
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.2)' // Faint white grid
				},
				stack: 'demo',
				stackWeight: 3
			}
		}
	}
});
