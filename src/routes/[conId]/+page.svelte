<script lang="ts">
	import { page } from '$app/state';
	import Chart from '$lib/component/Chart/Chart.svelte';
	import Buy from '$lib/modules/Buy.svelte';
	import Sell from '$lib/modules/Sell.svelte';
	import { account, positions } from '$lib/stores/account';
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
	import { onDestroy, onMount } from 'svelte';

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

	const position = $derived(
		$positions.length
			? $positions.find(
					(pos) => pos.contract.conId === contractDetails?.contract.conId && !!pos.pos
				)
			: null
	);

	let subsribed = $state(false);
	const requestLatestBarUpdates = () => {
		if ($websocket) {
			$websocket.send(
				JSON.stringify({ type: MessageType.SUBSCRIBE_LASTEST_BAR, data: contractDetails?.contract })
			);
			subsribed = true;
			$websocket?.addEventListener('message', (event) => {
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
			});
		}
	};

	const requestPositionsUpdates = () => {
		$websocket?.send(JSON.stringify({ type: MessageType.SUBSRIBE_POSITIONS_UPDATE }));
	};

	function getETOffsetFromLocal(dateStr: string) {
		const localDate = new Date(dateStr);
		const etString = localDate.toLocaleString('en-US', { timeZone: 'America/New_York' });
		const etDate = new Date(etString);
		return localDate.getTime() - etDate.getTime(); // in ms
	}
	const parseToCEST = (str: string) => {
		const year = str.slice(0, 4);
		const month = str.slice(4, 6);
		const day = str.slice(6, 8);
		const hour = str.slice(9, 11);
		const minute = str.slice(11, 13);

		const dateString = `${year}-${month}-${day}T${hour}:${minute}:00`;
		const offset = getETOffsetFromLocal(dateString);

		// Convert to Europe/Berlin
		const cestDate = new Date(new Date(dateString).getTime() + offset);
		return cestDate.toISOString();
	};

	const getHours = (input: string, label: string) =>
		input.split(';').flatMap((range) => {
			const [startStr, endStr] = range.split('-');

			const start = parseToCEST(startStr);
			const end = parseToCEST(endStr);

			return [
				{ x: new Date(start).getTime(), label: `${label} start` },
				{ x: new Date(end).getTime(), label: `${label} end` }
			];
		});

	let tradingHours: { x: number; label: string }[] = $state([]);
	$effect(() => {
		if ($websocket && contractDetails && baseData.length && !subsribed) {
			requestLatestBarUpdates();
			requestPositionsUpdates();
			if (contractDetails.tradingHours && contractDetails.liquidHours) {
				tradingHours = [
					...getHours(contractDetails.tradingHours, 'trading hours'),
					...getHours(contractDetails.liquidHours, 'liquid hours')
				];
			}
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

	onDestroy(() => {
		$websocket?.send(JSON.stringify({ type: MessageType.UNSUBSRIBE_POSITIONS_UPDATE }));
	});
</script>

{#if baseData.length && contractDetails}
	<div
		class={`grid ${limitPrice || position ? 'grid-cols-3' : 'grid-cols-2'} h-full max-h-screen w-full grow gap-12 overflow-y-auto`}
	>
		<div class="col-span-2 max-h-screen w-full">
			<div
				class="flex h-full max-h-screen grow flex-col border border-white/15 bg-gray-800 p-4 text-white"
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
					{tradingHours}
					{limitPrice}
					{target}
					onClick={handleClick}
				/>
			</div>
		</div>
		{#if limitPrice || position}
			<div class="flex w-full max-w-screen-sm flex-col space-y-8 p-8">
				<div class="flex w-full justify-between">
					<button
						type="button"
						aria-label="close"
						class="cursor-pointer text-gray-500 hover:text-gray-300"
						onclick={() => (limitPrice = undefined)}
					>
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
				{#if position}
					<div class="flex w-full flex-col border border-white/15 bg-gray-800 p-4 text-white">
						<Sell
							contract={contractDetails?.contract}
							currentPrice={currentData[currentData.length - 1].c!}
							{position}
							{limitPrice}
						></Sell>
					</div>
				{/if}
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
