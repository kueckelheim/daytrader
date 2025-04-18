<script lang="ts">
	import { page } from '$app/state';
	import Chart from '$lib/component/Chart/Chart.svelte';
	import { CHART_RANGE, type DataPoint } from '$lib/types/types';
	import calculateEma from '$lib/utils/calculateEma';
	import calculateMACD from '$lib/utils/calculateMACD';
	import calculateVWAP from '$lib/utils/calculateVWAP';
	import type { ContractDetails } from '@stoqey/ib';
	import { onMount } from 'svelte';

	let loading = $state(true);
	let baseData: DataPoint[] = $state([]);
	let contractDetails: ContractDetails | undefined = $state(undefined);
	let range = $state(CHART_RANGE.H1);

	let currentData = $derived(baseData.slice(-range));
	let currentPrice = $derived(baseData[baseData.length - 1]?.c);
	let stopLoss: number | undefined = $state(undefined);
	let limitPrice: number | undefined = $state(undefined);
	let target: number | undefined = $state();

	let currentPricePercentChangeRange = $derived.by(() => {
		if (!baseData || !currentPrice || baseData.length < range) return null;
		const beginningPrice = baseData[baseData.length - 1 - range]?.c;
		return beginningPrice ? ((currentPrice - beginningPrice) / beginningPrice) * 100 : null;
	});

	const handleRangeChange = (event: any) => {
		range = parseFloat(event?.target?.value);
	};

	let macd = $derived(baseData.length ? calculateMACD(baseData) : undefined);

	const handleClick = (y: number) => {
		limitPrice = parseFloat(y.toFixed(2));
	};

	// const position = $derived(
	// 	$positions.length
	// 		? $positions.find(
	// 				(pos) => pos.contract.conId === data.contractDetails[0].contract.conId && !!pos.pos
	// 			)
	// 		: null
	// );

	onMount(async () => {
		const response = await fetch(`/api/marketData?conId=${page.params.conId}`);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const body = (await response.json()) as {
			data: DataPoint[];
			contractDetails: ContractDetails;
		};
		baseData = body.data;
		contractDetails = body.contractDetails;
		loading = false;
	});
</script>

{#if baseData.length && contractDetails}
	<div class="grid grid-cols-2 gap-12">
		<div class="col-span-2 flex w-full flex-col border border-white/15 bg-gray-800 p-4 text-white">
			<div class="flex items-center space-x-2">
				<h2 class="mt-2 mb-2 text-2xl font-semibold">{contractDetails.contract.symbol}</h2>
				{#if currentPrice && currentPricePercentChangeRange}
					<div
						class={`rounded-sm px-1 py-0.5 shadow-lg ${currentPricePercentChangeRange > 0 ? 'bg-green-500' : 'bg-red-500'}`}
					>
						{currentPrice.toFixed(2)}
						<span class="ml-1">({currentPricePercentChangeRange.toFixed(2)}%)</span>
					</div>
				{/if}
			</div>
			<div class="flex justify-end">
				<fieldset onchange={handleRangeChange} aria-label="Choose a range" class="flex space-x-2">
					{#each Object.entries(CHART_RANGE) as [label, value]}
						<label
							class={`flex cursor-pointer items-center justify-center rounded-md text-sm font-semibold ${range === value ? 'text-gray-200 underline' : 'text-gray-500'} focus:outline-hidden`}
						>
							<input type="radio" name="memory-option" {value} class="sr-only" />
							<span>{label}</span>
						</label>
					{/each}
				</fieldset>
			</div>
			<Chart
				data={baseData.slice(-range)}
				ema9={calculateEma(baseData, 9)?.slice(-range)}
				ema20={calculateEma(baseData, 20)?.slice(-range)}
				ema200={calculateEma(baseData, 200)?.slice(-range)}
				vwap={calculateVWAP(baseData)?.slice(-range)}
				macdLine={macd?.macdLine.slice(-range)}
				signalLine={macd?.signalLine?.slice(-range)}
				positions={[]}
				{stopLoss}
				{limitPrice}
				{target}
				onClick={handleClick}
			/>
		</div>
	</div>
{/if}
