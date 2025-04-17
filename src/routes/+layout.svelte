<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { connectWebSocket } from '$lib/stores/websocket';

	let { children } = $props();

	onMount(() => {
		// Replace with your WebSocket server URL
		connectWebSocket('ws://localhost:3000');
	});
</script>

<div class="flex min-h-screen flex-1 flex-col bg-gray-900">
	{@render children()}
</div>
