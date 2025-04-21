<script lang="ts">
	import { positions } from '$lib/stores/account';
</script>

<div class="flex w-full flex-col border-b border-white/10 pt-8 text-gray-200">
	<h2 class="px-4 text-2xl">Positions</h2>
	<table class="mt-4 w-full text-left whitespace-nowrap">
		<colgroup>
			<col class="w-full sm:w-4/12" />
			<col class="lg:w-4/12" />
			<col class="lg:w-2/12" />
			<col class="lg:w-1/12" />
			<col class="lg:w-1/12" />
		</colgroup>
		<thead class="border-b border-white/10 text-sm/6 text-white">
			<tr>
				<th scope="col" class="px-4 py-2 font-semibold">Unrealized PNL</th>
				<th scope="col" class="hidden px-4 py-2 font-semibold sm:table-cell">Symbol</th>
				<th scope="col" class="hidden px-4 py-2 font-semibold sm:table-cell">Market Price</th>
				<th scope="col" class="hidden px-4 py-2 font-semibold sm:table-cell">Avg. Cost</th>
				<th scope="col" class="px-4 py-2 text-right font-semibold sm:text-left lg:pr-20"
					>Quantity</th
				>
				<th scope="col" class="hidden px-4 py-2 text-right font-semibold sm:table-cell"></th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-500/20">
			{#if $positions.length}
				{#each $positions as position}
					<tr>
						<td class="px-4 py-2">
							<div class="flex gap-x-3">
								<div class="font-mono text-sm/6 text-gray-400">{position.unrealizedPNL}</div>
							</div>
						</td>
						<td class="hidden px-4 py-2 sm:table-cell">
							<div class="flex gap-x-3">
								<div class="font-mono text-sm/6 text-gray-400">{position.contract.symbol}</div>
							</div>
						</td>
						<td class="hidden px-4 py-2 sm:table-cell">
							<div class="flex gap-x-3">
								<div class="font-mono text-sm/6 text-gray-400">{position.marketPrice}</div>
							</div>
						</td>
						<td class="px-4 py-2 text-sm/6 lg:pr-20">
							<div class="flex gap-x-3">
								<div class="font-mono text-sm/6 text-gray-400">{position.avgCost}</div>
							</div>
						</td>
						<td class="px-4 py-2 text-sm/6 lg:pr-20">
							<div class="flex gap-x-3">
								<div class="font-mono text-sm/6 text-gray-400">{position.pos}</div>
							</div>
						</td>
						<td class="hidden px-4 py-2 text-right text-sm/6 text-gray-400 sm:table-cell">
							<a
								type="button"
								href={`/${position.contract.conId} || 'SMART'}`}
								class="cursor-pointer text-blue-500 hover:text-blue-400">Go To Chart</a
							>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
	{#if !$positions.length}
		<span class="mt-1 px-4 text-sm/6 text-gray-400">No positions</span>
	{/if}
</div>
