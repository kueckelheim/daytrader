<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { connectWebSocket, websocket } from '$lib/stores/websocket';
	import { MessageType } from '$lib/types/types';

	let { children } = $props();

	onMount(() => {
		// Replace with your WebSocket server URL
		connectWebSocket('ws://localhost:3000');
	});

	const requestAccountUpdates = () => {
		$websocket?.send(JSON.stringify({ type: MessageType.SUBSCRIBE_ACCOUNT }));
	};

	$effect(() => {
		if ($websocket) {
			requestAccountUpdates();
		}
	});
</script>

<div class="flex min-h-screen flex-1 flex-col bg-gray-900">
	{@render children()}
</div>
