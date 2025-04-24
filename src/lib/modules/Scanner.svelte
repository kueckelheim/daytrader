<script lang="ts">
	import { matches } from '$lib/stores/scanner';
	import { websocket } from '$lib/stores/websocket';
	import { MessageType } from '$lib/types/types';
	import Button from '../../stories/Button.svelte';

	const requestScannerUpdates = () => {
		$websocket?.send(JSON.stringify({ type: MessageType.SUBSCRIBE_SCAN }));
	};

	let audioCtx: AudioContext | null = $state(null);

	function initAudio() {
		if (!audioCtx) {
			audioCtx = new AudioContext();
		}
		if (audioCtx.state === 'suspended') {
			audioCtx.resume();
		}
	}

	function playBeep() {
		if (!audioCtx) return;
		const oscillator = audioCtx.createOscillator();
		const gain = audioCtx.createGain();
		oscillator.connect(gain);
		gain.connect(audioCtx.destination);
		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
		oscillator.start();
		oscillator.stop(audioCtx.currentTime + 0.1);
	}

	let prevConIds = new Set<number>();

	$effect(() => {
		const currentConIds = new Set(
			$matches.map((m) => m.conId).filter((id) => id !== undefined) as number[]
		);
		const changed =
			$matches.length !== prevConIds.size || [...currentConIds].some((id) => !prevConIds.has(id));

		if (changed) {
			prevConIds = currentConIds;
			playBeep();
		}
	});

	$effect(() => {
		if ($websocket) {
			requestScannerUpdates();
		}
	});
</script>

<div
	class="flex w-full flex-1 flex-col overflow-y-auto border border-white/15 bg-gray-800 text-white"
>
	<div class="flex w-full justify-end">
		{#if audioCtx}
			<button
				class="m-4 cursor-pointer text-gray-300 hover:text-gray-100"
				type="button"
				aria-label="cancel audio"
				onclick={() => (audioCtx = null)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
					/>
				</svg>
			</button>
		{:else}
			<button
				class="m-4 cursor-pointer text-gray-300 hover:text-gray-100"
				type="button"
				aria-label="init audio"
				onclick={initAudio}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9.143 17.082a24.248 24.248 0 0 0 3.844.148m-3.844-.148a23.856 23.856 0 0 1-5.455-1.31 8.964 8.964 0 0 0 2.3-5.542m3.155 6.852a3 3 0 0 0 5.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 0 0 3.536-1.003A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"
					/>
				</svg>
			</button>
		{/if}
	</div>
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
				href={`/${match.conId}`}
				target="_blank"
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
