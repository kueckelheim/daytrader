<script lang="ts">
	import type { DataPoint, Position } from '$lib/types/types';
	import annotationPlugin from 'chartjs-plugin-annotation';
	import {
		Chart,
		TimeSeriesScale,
		LinearScale,
		LineController,
		PointElement,
		LineElement,
		CategoryScale,
		Tooltip
	} from 'chart.js';
	import { onMount } from 'svelte';
	import { getChartConfig } from './utils/getChartConfig';
	import drawStopLoss from './utils/drawStopLoss';
	import handleHover from './utils/handleHover';
	import drawTarget from './utils/drawTarget';
	import updateEma from './utils/updateEma';
	import updateData from './utils/updateData';
	import updateVwap from './utils/updateVwap';
	import updateMacd from './utils/updateMacd';
	import updateSignalLine from './utils/updateSignalLine';
	import drawPositionBoxes from './utils/drawPositionBoxes';
	import drawLimitPrice from './utils/drawLimitPrice';
	import handleClick from './utils/handleClick';

	interface Props {
		data: DataPoint[];
		stopLoss?: number | undefined;
		limitPrice?: number | undefined;
		target?: number | undefined;
		ema9?: { x: number; y: number }[];
		ema20?: { x: number; y: number }[];
		ema200?: { x: number; y: number }[];
		vwap?: { x: number; y: number }[];
		macdLine?: { x: number; y: number }[];
		signalLine?: { x: number; y: number }[];
		onClick?: (y: number) => void;
		positions: Position[] | undefined;
	}
	let {
		data,
		stopLoss,
		limitPrice,
		target,
		ema9,
		ema20,
		ema200,
		vwap,
		macdLine,
		signalLine,
		onClick,
		positions
	}: Props = $props();

	let canvas = $state() as HTMLCanvasElement;
	let chart: Chart | undefined = $state();
	let tooltipData:
		| { x: number; v: number; l: number; o: number; c: number; h: number }
		| undefined = $state();

	onMount(async () => {
		// @ts-ignore
		await import('chartjs-adapter-luxon');
		const { CandlestickController, CandlestickElement } = await import('chartjs-chart-financial');

		Chart.register(
			CandlestickElement,
			CandlestickController,
			TimeSeriesScale,
			LinearScale,
			LineController,
			PointElement,
			LineElement,
			annotationPlugin,
			CategoryScale,
			Tooltip
		);
		chart = new Chart(
			canvas,
			getChartConfig({
				data,
				signalLine,
				ema9,
				ema20,
				ema200,
				macdLine,
				updateToolTipData: (data) => (tooltipData = data),
				vwap,
				chart,
				onClick: (event) => handleClick(chart, event, onClick),
				onHover: (event) => handleHover(chart, event)
			})
		);
	});

	$effect(() => {
		const newStopLoss = stopLoss;
		if (chart) {
			drawStopLoss(newStopLoss, chart);
		}
	});
	$effect(() => {
		const newLimitPrice = limitPrice;
		if (chart) {
			drawLimitPrice(newLimitPrice, chart);
		}
	});
	$effect(() => {
		const newTarget = target;
		if (chart) {
			drawTarget(newTarget, chart);
		}
	});

	$effect(() => {
		const newEma9 = ema9;
		if (chart && newEma9) {
			updateEma(newEma9, 9, chart);
		}
	});
	$effect(() => {
		const newEma20 = ema20;
		if (chart && newEma20) {
			updateEma(newEma20, 20, chart);
		}
	});
	$effect(() => {
		const newEma200 = ema200;
		if (chart && newEma200) {
			updateEma(newEma200, 200, chart);
		}
	});
	$effect(() => {
		const newVWAP = vwap;
		if (chart && newVWAP) {
			updateVwap(newVWAP, chart);
		}
	});
	$effect(() => {
		const newMACD = macdLine;
		if (chart && newMACD) {
			updateMacd(newMACD, chart);
		}
	});
	$effect(() => {
		const newSignalLine = signalLine;
		if (chart && newSignalLine) {
			updateSignalLine(newSignalLine, chart);
		}
	});

	$effect(() => {
		const newData = data;
		if (chart) {
			updateData(newData, chart);
		}
	});

	$effect(() => {
		const newData = data;
		const newPositions = positions;
		if (chart && newData && newPositions?.length) {
			drawPositionBoxes(newData, newPositions, chart);
		}
	});
</script>

<div class="flex shrink-0 space-x-2 text-sm text-gray-300">
	<span
		>{tooltipData?.x
			? new Date(tooltipData?.x).toLocaleString('en-GB', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
			: ' '}</span
	>
</div>
<div class="flex shrink-0 space-x-2 text-sm text-gray-300">
	<span>V: {tooltipData?.v?.toFixed(0) || ' '}</span>
	<span>L: {tooltipData?.l?.toFixed(2) || ''}</span>
	<span>O: {tooltipData?.o?.toFixed(2) || ''}</span>
	<span>C: {tooltipData?.c?.toFixed(2) || ''}</span>
	<span>H: {tooltipData?.h?.toFixed(2) || ''}</span>
</div>
<div class="relative flex-grow overflow-hidden h-full">
	<canvas class="absolute inset-0 h-full w-full" bind:this={canvas}></canvas>
</div>
