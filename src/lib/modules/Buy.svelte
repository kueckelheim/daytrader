<script lang="ts">
	import { account } from '$lib/stores/account';
	import type { Contract } from '@stoqey/ib';

	interface Props {
		limitPrice: number | undefined;
		target: number | undefined;
		currentPrice: number;
		contract: Contract;
	}
	let { limitPrice = $bindable(), target = $bindable(), currentPrice, contract }: Props = $props();

	let balance = $derived($account.availableFundsEUR || 0);
	let orderType: 'LMT' | 'MKT' = $state('LMT');

	let rewardRatio: number | undefined = $state();
	let nShares: number | undefined = $state();
	// let nShares = $derived.by(() => {
	// 	if (!stopLoss) return null;
	// 	const riskPerShare = currentPrice - stopLoss;
	// 	let shares = Math.floor((balance * 0.02) / riskPerShare);
	// 	return (shares * currentPrice > balance ? Math.floor(balance / currentPrice) : shares) || 1;
	// });

	// const updateTarget = (price: number, ratio: number, stop: number) => {
	// 	target = price + (price - stop) * ratio;
	// };
	// $effect(() => {
	// 	const newPrice = currentPrice;
	// 	const newRatio = rewardRatio;
	// 	const stop = stopLoss;
	// 	if (newPrice && newRatio && stop) {
	// 		updateTarget(newPrice, newRatio, stop);
	// 	}
	// });

	// const handleRewardRatioInput = (event: any) => {
	// 	if (stopLoss) {
	// 		const newValue = event.target.value;
	// 		target = Number((currentPrice + (currentPrice - stopLoss) * newValue).toFixed(5));
	// 		rewardRatio = newValue;
	// 	}
	// };

	const isTooExpensive = $derived(
		nShares &&
			(orderType === 'LMT' ? !!limitPrice : true) &&
			nShares * (orderType === 'LMT' ? limitPrice || currentPrice : currentPrice) > balance
	);
	const isInvalid = $derived(
		isTooExpensive ||
			// (stopLoss && stopLoss >= currentPrice) ||
			!nShares
	);

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		console.log(limitPrice, currentPrice, nShares, target);
		const response = await fetch('/api/order', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				limitPrice: limitPrice?.toFixed(2),
				nShares,
				conId: contract.conId,
				accountId: $account.accountId,
				exchange: contract.exchange,
				orderType
			})
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		console.log(await response.json());
	};
</script>

<form onsubmit={handleSubmit} class="inline-flex flex-col">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold">Buy</h2>

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
			<div class="text-sm/6 font-medium">Cost</div>
			<div
				class="col-start-1 row-start-1 flex bg-gray-800 px-2 py-1.5 font-mono text-base text-gray-50 outline-1 -outline-offset-1 outline-gray-700 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-indigo-300 sm:text-sm/6"
			>
				{nShares ? (nShares * currentPrice).toFixed(2) : 'NA'}
			</div>
		</div>
	</div>

	<div class="flex justify-end">
		<button
			type="submit"
			disabled={!!isInvalid}
			class={`mt-4 w-full cursor-pointer px-8 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-1 focus-visible:outline-offset-1 ${isInvalid ? 'bg-gray-700' : 'bg-indigo-500 hover:bg-indigo-600 focus-visible:outline-indigo-500'}`}
			>Buy</button
		>
	</div>
	<div class="flex justify-end">
		{#if isTooExpensive}
			<div class="text-xs text-red-500">Not enough cash to make this deal.</div>
		{:else}{/if}
	</div>
</form>
