<script lang="ts">
	import { base } from '$app/paths';
	import type { Pack } from '$lib/packs';
	import { getScores, type ScoreEntry } from '$lib/leaderboard';
	import { browser } from '$app/environment';

	let { data } = $props();
	const packs = $derived<Pack[]>(data.packs);

	let scores = $state<ScoreEntry[]>([]);
	$effect(() => {
		if (browser) scores = getScores().slice(0, 10);
	});
</script>

<div class="container">
	<header>
		<h1>Quiz Lab</h1>
		<p class="subtitle">Pick a pack. Race the clock. Rate the questions. Watch packs ship while you play.</p>
	</header>

	<section>
		<div class="pack-grid">
			{#each packs as pack (pack.id)}
				<a class="pack-card" href="{base}/play/{pack.id}">
					<div class="pack-header">
						<h2>{pack.title}</h2>
						<span class="category">{pack.category}</span>
					</div>
					<p class="description">{pack.description}</p>
					<div class="meta">
						<span class="count">{pack.questions.length} questions</span>
						<span class="play">Play →</span>
					</div>
				</a>
			{/each}
		</div>
	</section>

	{#if scores.length > 0}
		<section class="leaderboard">
			<h2 class="lb-title">Leaderboard</h2>
			<div class="lb-table">
				<div class="lb-header">
					<span class="lb-rank">#</span>
					<span class="lb-name">Name</span>
					<span class="lb-pack">Pack</span>
					<span class="lb-score">Score</span>
				</div>
				{#each scores as entry, i (i)}
					<div class="lb-row">
						<span class="lb-rank">{i + 1}</span>
						<span class="lb-name">{entry.name}</span>
						<span class="lb-pack">{entry.packTitle}</span>
						<span class="lb-score">{entry.score}/{entry.total}</span>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<footer>
		<p>
			Want to add your own pack? Drop a JSON file in <code>app/src/lib/data/packs/</code> and open a PR.
			This whole app is the studio-ai demo loop — every change you see ships through it.
		</p>
	</footer>
</div>

<style>
	.container {
		max-width: 880px;
		margin: 0 auto;
		padding: 2.5rem 2rem;
	}

	header {
		margin-bottom: 2.5rem;
	}

	h1 {
		font-size: 2.25rem;
		font-weight: 800;
		color: var(--text-1);
		margin: 0;
		letter-spacing: -0.02em;
	}

	.subtitle {
		color: var(--text-2);
		margin: 0.5rem 0 0;
		font-size: 1rem;
		max-width: 60ch;
	}

	.pack-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.pack-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.25rem;
		background: var(--surface);
		text-decoration: none;
		color: inherit;
		transition: border-color 120ms ease, transform 120ms ease, box-shadow 120ms ease;
	}

	.pack-card:hover {
		border-color: var(--accent);
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(29, 78, 216, 0.08);
	}

	.pack-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.5rem;
	}

	h2 {
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--text-1);
		margin: 0;
	}

	.category {
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		background: var(--accent-bg);
		color: var(--accent);
		white-space: nowrap;
	}

	.description {
		color: var(--text-2);
		font-size: 0.9rem;
		line-height: 1.5;
		margin: 0;
		flex: 1;
	}

	.meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.85rem;
		color: var(--text-3);
	}

	.play {
		color: var(--accent);
		font-weight: 600;
	}

	.leaderboard {
		margin-top: 3rem;
	}

	.lb-title {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text-1);
		margin: 0 0 1rem;
	}

	.lb-table {
		border: 1px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
	}

	.lb-header,
	.lb-row {
		display: grid;
		grid-template-columns: 2rem 1fr 1fr 4rem;
		gap: 0.75rem;
		padding: 0.6rem 1rem;
		align-items: center;
		font-size: 0.875rem;
	}

	.lb-header {
		background: var(--surface);
		color: var(--text-3);
		font-weight: 600;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		border-bottom: 1px solid var(--border);
	}

	.lb-row {
		background: var(--bg);
		color: var(--text-2);
		border-bottom: 1px solid var(--border);
	}

	.lb-row:last-child {
		border-bottom: none;
	}

	.lb-rank {
		color: var(--text-3);
		font-weight: 700;
		font-size: 0.8rem;
	}

	.lb-row .lb-rank:first-child {
		color: var(--accent);
	}

	.lb-name {
		font-weight: 600;
		color: var(--text-1);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lb-pack {
		color: var(--text-3);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lb-score {
		text-align: right;
		font-weight: 600;
		color: var(--accent);
	}

	footer {
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
		color: var(--text-3);
		font-size: 0.875rem;
		line-height: 1.6;
	}

	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
		background: var(--code-bg);
		padding: 0.1rem 0.35rem;
		border-radius: 4px;
		font-size: 0.85em;
	}
</style>
