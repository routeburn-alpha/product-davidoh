<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { base } from '$app/paths';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="top-nav">
	<a class="brand" href="{base}/">Quiz Lab</a>
	<a
		class="github"
		href="https://github.com/routeburn-alpha/product-demo-template"
		rel="noopener"
		target="_blank">View on GitHub</a
	>
</nav>

{@render children()}

<style>
	:global(html) {
		color-scheme: dark;
	}

	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background: var(--bg);
		color: var(--text-1);
	}

	.top-nav {
		max-width: 1100px;
		margin: 0 auto;
		padding: 1rem 2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.brand {
		font-weight: 800;
		font-size: 1rem;
		color: var(--text-1);
		text-decoration: none;
		letter-spacing: -0.01em;
	}

	.github {
		font-size: 0.85rem;
		color: var(--text-3);
		text-decoration: none;
	}

	.github:hover {
		color: var(--accent);
	}
</style>
