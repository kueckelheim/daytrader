<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-1 flex-col bg-gray-900">
	{@render children()}
</div>
