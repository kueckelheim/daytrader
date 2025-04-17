<script lang="ts">
	import Scanner from '$lib/modules/Scanner.svelte';
	import { account } from '$lib/stores/account';
	import { websocket } from '$lib/stores/websocket';
	import { MessageType } from '$lib/types/types';

	const requestAccountUpdates = () => {
		console.log($websocket);
		$websocket?.send(JSON.stringify({ type: MessageType.SUBSCRIBE_ACCOUNT }));
	};

	$effect(() => {
		if ($websocket) {
			requestAccountUpdates();
		}
	});
</script>

<div
	class="fixed inset-0 h-full w-full divide-y divide-gray-500/20 overflow-auto rounded-b-xl bg-gray-900 shadow-2xl"
>
	<div class="grid grid-cols-1">
		<input
			type="text"
			class="col-start-1 row-start-1 h-12 w-full bg-transparent pr-4 pl-11 text-base text-white outline-hidden placeholder:text-gray-500 sm:text-sm"
			placeholder="Search symbol..."
			role="combobox"
			aria-expanded="false"
			aria-controls="options"
		/>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-500"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
			/>
		</svg>
	</div>

	<!-- Default state, show/hide based on command palette state. -->
	<ul class="max-h-80 scroll-py-2 divide-y divide-gray-500/20 overflow-y-auto">
		<li class="p-2">
			<h2 class="mt-4 mb-2 px-3 text-xs font-semibold text-gray-200">Recent searches</h2>
			<ul class="text-sm text-gray-400">
				<!-- Active: "bg-gray-800 text-white outline-hidden" -->
				<li class="group flex cursor-default items-center rounded-md px-3 py-2 select-none">
					<!-- Active: "text-white forced-colors:text-[Highlight]", Not Active: "text-gray-500" -->
					<svg
						class="size-6 flex-none text-gray-500"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path
							fill-rule="evenodd"
							d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="ml-3 flex-auto truncate">Workflow Inc. / Website Redesign</span>
					<!-- Not Active: "hidden" -->
					<span class="ml-3 hidden flex-none text-gray-400">Jump to...</span>
				</li>
			</ul>
		</li>
		<li class="p-2">
			<h2 class="sr-only">Quick actions</h2>
			<ul class="text-sm text-gray-400">
				<li class="flex w-full">
					<a
						class="group w-full flex cursor-pointer items-center rounded-md px-3 py-2 select-none hover:bg-gray-800 hover:text-white hover:outline-hidden"
						href="/scanner"
						target="_blank"
					>
						<svg
							class="size-6 flex-none text-gray-500"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path
								fill-rule="evenodd"
								d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
								clip-rule="evenodd"
							/>
						</svg>
						<span class="ml-3 flex-auto truncate">Open Scanner...</span>
						<span class="ml-3 flex-none text-xs font-semibold text-gray-400"
							><kbd class="font-sans">⌘</kbd><kbd class="font-sans">S</kbd></span
						>
					</a>
				</li>
				<li class="group flex cursor-default items-center rounded-md px-3 py-2 select-none">
					<svg
						class="size-6 flex-none text-gray-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
						/>
					</svg>
					<span class="ml-3 flex-auto truncate">Open Watchlist...</span>
					<span class="ml-3 flex-none text-xs font-semibold text-gray-400"
						><kbd class="font-sans">⌘</kbd><kbd class="font-sans">F</kbd></span
					>
				</li>
				<li class="group flex cursor-default items-center rounded-md px-3 py-2 select-none">
					<svg
						class="size-6 flex-none text-gray-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
						/>
					</svg>
					<span class="ml-3 flex-auto truncate">Add hashtag...</span>
					<span class="ml-3 flex-none text-xs font-semibold text-gray-400"
						><kbd class="font-sans">⌘</kbd><kbd class="font-sans">H</kbd></span
					>
				</li>
				<li class="group flex cursor-default items-center rounded-md px-3 py-2 select-none">
					<svg
						class="size-6 flex-none text-gray-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
						/>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
					</svg>
					<span class="ml-3 flex-auto truncate">Add label...</span>
					<span class="ml-3 flex-none text-xs font-semibold text-gray-400"
						><kbd class="font-sans">⌘</kbd><kbd class="font-sans">L</kbd></span
					>
				</li>
			</ul>
		</li>
	</ul>

	<div class="px-6 py-14 text-center sm:px-14">
		<svg
			class="mx-auto size-6 text-gray-500"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			aria-hidden="true"
			data-slot="icon"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
			/>
		</svg>
		<p class="mt-4 text-sm text-gray-200">
			<span>Funds: {$account.availableFundsEUR}€</span>
			<span>Funds: {$account.availableFundsUSD}$</span>
		</p>
	</div>
</div>
