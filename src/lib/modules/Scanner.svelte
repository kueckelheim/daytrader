<script lang="ts">
	import { matches } from '$lib/stores/scanner';
	import { websocket } from '$lib/stores/websocket';
	import { MessageType } from '$lib/types/types';

	const requestScannerUpdates = () => {
		console.log($websocket);
		$websocket?.send(JSON.stringify({ type: MessageType.SUBSCRIBE_SCAN }));
	};

	$effect(() => {
		if ($websocket) {
			requestScannerUpdates();
		}
	});

	$effect(() => console.log($matches));
</script>

<div
	class="flex max-h-96 w-full max-w-screen-lg flex-col overflow-y-scroll border border-white/15 bg-gray-800 text-white"
>
	<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
		<div class="grid w-full min-w-full grid-cols-5 border-b border-gray-700">
			<div class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-white sm:pl-0">Symbol</div>
			<div class="px-3 py-3.5 text-left text-sm font-semibold text-white">HotByVolume</div>
			<div class="px-3 py-3.5 text-left text-sm font-semibold text-white">Top Gainer</div>
			<div class="px-3 py-3.5 text-left text-sm font-semibold text-white">Exchange</div>
			<div class="px-3 py-3.5 text-left text-sm font-semibold text-white">Currency</div>
		</div>
		{#each $matches as match}
			<a
				href={`/${match.conId}/${match.exchange}`}
				class="grid w-full min-w-full grid-cols-5 border-b border-gray-700 hover:bg-gray-800"
			>
				<div class="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-white sm:pl-0">
					{match.symbol}
				</div>

				<div class="px-3 py-4 text-sm whitespace-nowrap text-gray-300">
					<div
						class={`h-4 w-4 rounded-full ${match.isHotByVolume ? 'bg-green-400' : 'bg-amber-400'}`}
					></div>
				</div>
				<div class="px-3 py-4 text-sm whitespace-nowrap text-gray-300">
					<div
						class={`h-4 w-4 rounded-full ${match.isTopGainer ? 'bg-green-400' : 'bg-amber-400'}`}
					></div>
				</div>
				<div class="px-3 py-4 text-sm whitespace-nowrap text-gray-300">
					<div class={`h-4 w-4 rounded-full`}>{match.exchange}</div>
				</div>
				<div class="px-3 py-4 text-sm whitespace-nowrap text-gray-300">
					<div class={`h-4 w-4 rounded-full`}>{match.currency}</div>
				</div>
			</a>
		{/each}
	</div>
</div>
