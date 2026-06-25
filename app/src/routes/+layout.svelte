<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { base } from '$app/paths';
	import { theme, toggleTheme } from '$lib/theme';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="top-nav">
	<a class="brand" href="{base}/">Quiz Lab</a>
	<div class="nav-right">
		<button class="theme-toggle" onclick={toggleTheme} aria-label="Toggle theme">
			{$theme === 'dark' ? 'Light' : 'Dark'}
		</button>
		<a
			class="github"
			href="https://github.com/routeburn-alpha/product-demo-template"
			rel="noopener"
			target="_blank">View on GitHub</a
		>
	</div>
</nav>

{@render children()}

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background: var(--bg);
		color: var(--text-1);
	}

	.top-nav {
		max-width: 880px;
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

	.nav-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.theme-toggle {
		background: none;
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.25rem 0.625rem;
		font: inherit;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-2);
		cursor: pointer;
	}

	.theme-toggle:hover {
		border-color: var(--accent);
		color: var(--accent);
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
