<script lang="ts">
	import { page } from '$app/state';
	import Chart from '$lib/component/Chart/Chart.svelte';
	import Buy from '$lib/modules/Buy.svelte';
	import { account } from '$lib/stores/account';
	import { websocket } from '$lib/stores/websocket';
	import {
		CHART_RANGE,
		MessageType,
		type DataPoint,
		type WebSocketMessage
	} from '$lib/types/types';
	import calculateEma from '$lib/utils/calculateEma';
	import calculateMACD from '$lib/utils/calculateMACD';
	import calculateVWAP from '$lib/utils/calculateVWAP';
	import type { ContractDetails } from '@stoqey/ib';
	import { onMount } from 'svelte';

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

	let subsribed = $state(false);
	const requestLatestBarUpdates = () => {
		if ($websocket) {
			$websocket.send(
				JSON.stringify({ type: MessageType.SUBSCRIBE_LASTEST_BAR, data: contractDetails?.contract })
			);
			subsribed = true;
			$websocket.onmessage = (event) => {
				const message: WebSocketMessage = JSON.parse(event.data);
				if (message.type === MessageType.LASTEST_BAR) {
					const existingBar = baseData.find((bar) => bar.x === parseInt(message.data.time!) * 1000);
					const formatted: DataPoint = {
						h: message.data.high,
						l: message.data.low,
						o: message.data.open,
						c: message.data.close,
						v: message.data.volume,
						x: parseInt(message.data.time!) * 1000
					};
					if (existingBar) {
						baseData = [...baseData.slice(0, -1), formatted];
					} else {
						baseData = [...baseData, formatted];
					}
				}
			};
		}
	};

	$effect(() => {
		if ($websocket && contractDetails && baseData.length && !subsribed) {
			requestLatestBarUpdates();
		}
	});

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
	});
</script>

{#if baseData.length && contractDetails}
	<div class={`grid ${limitPrice ? 'grid-cols-3' : 'grid-cols-2'} w-full gap-12 max-h-screen h-full`}>
		<div
			class="col-span-2 flex max-h-full w-full flex-col border border-white/15 bg-gray-800 text-white p-4"
		>
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
		{#if limitPrice}
			<div class="flex w-full max-w-screen-sm flex-col space-y-8 p-8">
				<div class="flex w-full justify-between">
					<button type="button" aria-label="close" class="cursor-pointer hover:text-gray-300 text-gray-500" onclick={() => (limitPrice = undefined)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 19.5 8.25 12l7.5-7.5"
							/>
						</svg>
					</button>

					<div class="text-xs text-gray-400">
						{$account.availableFundsEUR} EUR |
						{$account.availableFundsUSD} USD
					</div>
				</div>
				<!-- {#if position}
				<div
					class="flex w-full flex-col border border-white/15 bg-gray-800 p-4 text-white"
				>
					<Sell
						contract={data.contractDetails[0].contract}
						currentPrice={currentData[currentData.length - 1].c!}
						{position}
					></Sell>
				</div>
			{/if} -->
				<div class="flex w-full flex-col border border-white/15 bg-gray-800 p-4 text-white">
					<Buy
						contract={contractDetails.contract}
						currentPrice={currentData[currentData.length - 1].c!}
						bind:limitPrice
						bind:target
					></Buy>
				</div>
			</div>
		{/if}
	</div>
{/if}
