<script lang="ts">
	import type { Contract } from '@stoqey/ib';
	import { onMount, tick } from 'svelte';

	let contracts: Contract[] = $state([]);
	let container = $state(null) as unknown as HTMLElement;

	const searchSymbol = async () => {
		try {
			const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = (await response.json()) as Contract[];
			contracts = data;
			console.log(data);
		} catch (error) {
			console.error('Error fetching search results:', error);
		}
	};

	let debounceTimer: ReturnType<typeof setTimeout>;

	let submitTimer: ReturnType<typeof setTimeout> | null = null;

	let searchQuery = $state('');

	const handleSubmit = (event?: Event) => {
		event?.preventDefault();

		clearTimeout(debounceTimer);

		// Throttle the submit: only allow a new request if there's no active submitTimer
		if (submitTimer) return;

		searchSymbol();

		// Set a new timer to block any additional submits for 1.5 seconds
		submitTimer = setTimeout(() => {
			submitTimer = null;
		}, 1500);
	};

	const handleSearchInput = () => {
		if (submitTimer) {
			clearTimeout(submitTimer);
			submitTimer = null;
		}
		clearTimeout(debounceTimer);
		if (searchQuery.length === 0) {
			contracts = [];
			return;
		}
		debounceTimer = setTimeout(() => {
			if (searchQuery.length >= 2) {
				handleSubmit();
			}
		}, 1500);
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		const items = container.querySelectorAll('a, input');
		const activeElement = document.activeElement as HTMLElement;
		const index = Array.from(items).indexOf(activeElement as HTMLElement);
		if (event.key === 'ArrowDown' && index < items.length - 1) {
			(items[index + 1] as HTMLElement).focus();
			event.preventDefault();
		}
		if (event.key === 'ArrowUp' && index > 0) {
			(items[index - 1] as HTMLElement).focus();
			event.preventDefault();
		}
	};

	onMount(async () => {
		await tick();
		container.querySelector('input')?.focus();
	});
</script>

<div
	onkeydown={handleKeyDown}
	bind:this={container}
	role="presentation"
	class="fixed inset-0 h-full w-full divide-y divide-gray-500/20 overflow-auto rounded-b-xl bg-gray-900 shadow-2xl"
>
	<form onsubmit={handleSubmit} class="grid grid-cols-1">
		<!-- svelte-ignore a11y_autofocus -->
		<input
			type="text"
			class="col-start-1 row-start-1 h-12 w-full bg-transparent pr-4 pl-11 text-base text-white outline-hidden placeholder:text-gray-500 sm:text-sm"
			placeholder="Search symbol..."
			role="combobox"
			aria-expanded="false"
			aria-controls="options"
			oninput={handleSearchInput}
			bind:value={searchQuery}
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
	</form>

	{#if !contracts.length}
		<div class="max-h-80 w-full scroll-py-2 divide-y divide-gray-500/20 overflow-y-auto">
			<div class="w-full p-2">
				<h2 class="mt-4 mb-2 px-3 text-xs font-semibold text-gray-200">Quick actions</h2>
				<ul class="w-full text-sm text-gray-400">
					<li class="flex w-full" tabindex="-1" role="option" aria-selected="false">
						<a
							class="group flex w-full cursor-pointer items-center rounded-md px-3 py-2 select-none hover:bg-gray-800 hover:text-white hover:outline-hidden focus:text-white focus:outline-hidden"
							href="/scanner"
							target="_blank"
						>
							<svg
								class="size-6 flex-none text-gray-500 group-focus:text-white"
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
					<li class="flex w-full" tabindex="-1" role="option" aria-selected="false">
						<a
							href="#"
							class="group flex w-full cursor-pointer items-center rounded-md px-3 py-2 select-none hover:bg-gray-800 hover:text-white hover:outline-hidden focus:text-white focus:outline-hidden"
						>
							<svg
								class="size-6 flex-none text-gray-500 group-focus:text-white"
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
							></a
						>
					</li>
				</ul>
			</div>
		</div>
	{:else}
		<!-- Results, show/hide based on command palette state. -->
		<ul class="max-h-96 overflow-y-auto p-2 text-sm text-gray-400">
			{#each contracts as contract}
				<!-- Active: "bg-gray-800 text-white outline-hidden" -->
				<li class="flex w-full" tabindex="-1" role="option" aria-selected="false">
					<a
						href={`/${contract.conId}`}
						target="_blank"
						class="group flex w-full cursor-pointer items-center rounded-md px-3 py-2 select-none hover:bg-gray-800 hover:text-white hover:outline-hidden focus:text-white focus:outline-hidden"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6 flex-none text-gray-500 group-focus:text-white"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
							/>
						</svg>

						<div class="ml-3 flex flex-col">
							<span class="flex-auto truncate">{contract.symbol}</span>
							<div class="flex items-center gap-x-2 text-xs/5 text-gray-500">
								<span>{contract.description}</span><svg
									viewBox="0 0 2 2"
									class="size-0.5 fill-current"
								>
									<circle cx="1" cy="1" r="1" />
								</svg><span>{contract.primaryExch}</span><svg
									viewBox="0 0 2 2"
									class="size-0.5 fill-current"
								>
									<circle cx="1" cy="1" r="1" />
								</svg><span>{contract.currency}</span><svg
									viewBox="0 0 2 2"
									class="size-0.5 fill-current"
								>
									<circle cx="1" cy="1" r="1" />
								</svg><span>{contract.secType}</span>
							</div>
						</div>
						<div class="flex-1"></div>
						<!-- Not Active: "hidden" -->
						<span class="ml-3 hidden flex-none text-gray-400 group-focus:flex">Jump to...</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
