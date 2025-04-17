<script lang="ts">
	import { account } from '$lib/stores/account';
	import { websocket } from '$lib/stores/websocket';

	const requestAccountUpdates = () => {
		console.log($websocket);
	};

	$effect(() => {
		if ($websocket) {
			requestAccountUpdates();
		}
	});
</script>

<header
	class="flex w-full items-center justify-between bg-gray-900 px-6 py-2 text-xs text-gray-300"
>
	<a aria-label="Go to home" href="/"
		><svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			class="size-4 text-gray-50"
		>
			<path
				d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"
			/>
			<path
				d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"
			/>
		</svg>
	</a>
	<div class="flex space-x-2 font-mono">
		<div>Funds: {$account.availableFunds}€</div>
		<div>Funds: {$account.availableFundsUSD}$</div>
	</div>
</header>

<div class="flex h-full w-full flex-1 flex-col p-12">
	<div class="mt-12">
		<!-- <Orders /> -->
	</div>

	<div class="mt-12">
		<!-- <Positions /> -->
	</div>

	<div class="mt-12">
		<!-- <Scanner /> -->
	</div>
</div>
