<script lang="ts">
	import { account } from '$lib/stores/account';
	import { websocket } from '$lib/stores/websocket';
	import { MessageType, type WebSocketMessage } from '$lib/types/types';
	import type { Contract, Position } from '@stoqey/ib';
	import { onDestroy } from 'svelte';

	interface Props {
		position: Position;
		currentPrice: number;
		contract: Contract;
		limitPrice: number | undefined;
	}
	let { position, currentPrice, contract, limitPrice }: Props = $props();

	let orderType = $state('MKT');
	let nShares: number = $state(position.pos);
	let pnl: number | undefined = $state(position.unrealizedPNL);
	let percent: number | undefined = $derived.by(() => {
		if (!pnl) return undefined;
		if (!position.marketValue && !currentPrice) return undefined;
		return (pnl / ((position.marketValue || currentPrice * position.pos) - pnl)) * 100;
	});

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		const response = await fetch('/api/order', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				nShares,
				conId: contract.conId,
				accountId: $account.accountId,
				exchange: contract.exchange,
				orderType,
				limitPrice
			})
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		console.log(await response.json());
	};

	let subsribed = $state(false);
	const requestPNL = () => {
		if ($websocket) {
			$websocket.send(
				JSON.stringify({
					type: MessageType.SUBSCRIBE_PNL_POSITION,
					data: { conId: position.contract.conId, accountId: $account.accountId }
				})
			);
			subsribed = true;
			$websocket?.addEventListener('message', (event) => {
				const message: WebSocketMessage = JSON.parse(event.data);
				if (message.type === MessageType.PNL_UPDATE_POSITION) {
					if (message.data.unrealizedPnL) {
						pnl = message.data.unrealizedPnL;
					}
				}
			});
		}
	};

	let conId: number | undefined;
	let accountId: string | undefined;
	$effect(() => {
		if ($websocket && position?.contract?.conId && $account.accountId && !subsribed) {
			console.log('requestPNL');
			conId = position.contract.conId;
			accountId = $account.accountId;
			requestPNL();
		}
	});

	onDestroy(() => {
		if (conId && accountId) {
			$websocket?.send(
				JSON.stringify({
					type: MessageType.UNSUBSCRIBE_PNL_POSITION,
					data: { accountId, conId }
				})
			);
		}
	});
</script>

<form onsubmit={handleSubmit} class="inline-flex flex-col">
	<div class="flex justify-between">
		<div
			class={`flex items-center rounded-full px-2 py-0.5 text-sm font-medium ${percent && percent > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
		>
			{#if percent && percent > 0}
				<svg
					class="mr-0.5 -ml-1 size-4 shrink-0 self-center text-green-500"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
					data-slot="icon"
				>
					<path
						fill-rule="evenodd"
						d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
						clip-rule="evenodd"
					/>
				</svg>
			{:else}
				<svg
					class="mr-0.5 -ml-1 size-4 shrink-0 self-center text-red-500"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
					data-slot="icon"
				>
					<path
						fill-rule="evenodd"
						d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
						clip-rule="evenodd"
					/>
				</svg>
			{/if}
			{percent?.toFixed(2)}%
		</div>
		<fieldset class="flex space-x-2 text-xs font-semibold">
			<label
				aria-label="Limit Order"
				class={`flex w-8 justify-center py-1 ${orderType === 'LMT' ? 'bg-indigo-500' : 'cursor-pointer bg-gray-700/80'}`}
			>
				<input
					type="radio"
					name="order-type"
					value={'LMT'}
					bind:group={orderType}
					class="sr-only"
				/>
				<span>LMT</span>
			</label>
			<label
				aria-label="Limit Order"
				class={`flex w-8 justify-center py-1 ${orderType === 'MKT' ? 'bg-indigo-500' : 'cursor-pointer bg-gray-700/80'}`}
			>
				<input
					type="radio"
					name="order-type"
					value={'MKT'}
					bind:group={orderType}
					class="sr-only"
				/>
				<span>MKT</span>
			</label>
		</fieldset>
	</div>
	<dd class="mt-2 flex w-full items-baseline justify-between space-x-2 md:block lg:flex">
		<div class="text-white-600 flex items-baseline text-base font-semibold">
			{pnl?.toFixed(2)}
			<span class="ml-2 text-sm font-medium text-gray-500">{position.pos} shares</span>
		</div>
	</dd>
	<div class="mt-4 flex items-center space-x-4">
		{#if orderType === 'LMT'}
			<div class="w-full">
				<label for="entry-price" class="block text-sm/6 font-medium">Limit Price</label>
				<div class="grid grid-cols-1">
					<input
						type="number"
						name="entry-price"
						step="any"
						id="entry-price"
						disabled
						value={limitPrice}
						class="col-start-1 row-start-1 block w-auto min-w-0 px-2 py-1.5 font-mono text-base text-gray-50 outline-1 -outline-offset-1 outline-gray-700 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-indigo-300 sm:text-sm/6"
					/>
				</div>
			</div>
		{/if}
		<div class="w-full">
			<div class="text-sm/6 font-medium">nShares</div>
			<input
				type="text"
				name="nShares"
				id="nShares"
				step="any"
				bind:value={nShares}
				class="block w-full bg-gray-800 py-1.5 pr-3 pl-3 font-mono text-base text-gray-50 outline-1 -outline-offset-1 outline-gray-700 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-indigo-300 sm:text-sm/6"
			/>
		</div>
		<div class="w-full">
			<div class="text-sm/6 font-medium">Value</div>
			<div
				class="col-start-1 row-start-1 flex bg-gray-800 px-2 py-1.5 font-mono text-base text-gray-50 outline-1 -outline-offset-1 outline-gray-700 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-indigo-300 sm:text-sm/6"
			>
				{nShares ? (nShares * (position.marketPrice || currentPrice)).toFixed(2) : 'NA'}
			</div>
		</div>
	</div>

	<div class="flex justify-end">
		<button
			type="submit"
			class={`'bg-indigo-700 mt-4 w-full cursor-pointer bg-indigo-500 px-8 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-600 focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-indigo-500`}
			>Sell</button
		>
	</div>
</form>
