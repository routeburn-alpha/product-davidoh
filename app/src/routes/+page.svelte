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

	<div class="main-layout">
		<section class="packs-col">
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

		<aside class="leaderboard-col">
			<h2 class="lb-title">Leaderboard</h2>
			{#if scores.length > 0}
				<div class="lb-table">
					<div class="lb-header">
						<span class="lb-rank">#</span>
						<span class="lb-name">Name</span>
						<span class="lb-score">Score</span>
					</div>
					{#each scores as entry, i (i)}
						<div class="lb-row">
							<span class="lb-rank">{i + 1}</span>
							<span class="lb-name">
								{entry.name}
								<span class="lb-pack">{entry.packTitle}</span>
							</span>
							<span class="lb-score">{entry.score}/{entry.total}</span>
						</div>
					{/each}
				</div>
			{:else}
				<p class="lb-empty">Play a quiz to appear here.</p>
			{/if}
		</aside>
	</div>

	<footer>
		<p>
			Want to add your own pack? Drop a JSON file in <code>app/src/lib/data/packs/</code> and open a PR.
			This whole app is the studio-ai demo loop — every change you see ships through it.
		</p>
	</footer>
</div>

<style>
	.container {
		max-width: 1100px;
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

	.main-layout {
		display: grid;
		grid-template-columns: 1fr 280px;
		gap: 2rem;
		align-items: start;
	}

	@media (max-width: 720px) {
		.main-layout {
			grid-template-columns: 1fr;
		}
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
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
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

	/* Leaderboard sidebar */

	.leaderboard-col {
		position: sticky;
		top: 1rem;
	}

	.lb-title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-1);
		margin: 0 0 0.75rem;
	}

	.lb-empty {
		font-size: 0.875rem;
		color: var(--text-3);
		margin: 0;
		padding: 1rem;
		border: 1px solid var(--border);
		border-radius: 10px;
		text-align: center;
	}

	.lb-table {
		border: 1px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
	}

	.lb-header,
	.lb-row {
		display: grid;
		grid-template-columns: 1.5rem 1fr 3rem;
		gap: 0.5rem;
		padding: 0.55rem 0.75rem;
		align-items: center;
	}

	.lb-header {
		background: var(--surface);
		color: var(--text-3);
		font-weight: 600;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		border-bottom: 1px solid var(--border);
	}

	.lb-row {
		background: var(--bg);
		border-bottom: 1px solid var(--border);
	}

	.lb-row:last-child {
		border-bottom: none;
	}

	.lb-rank {
		color: var(--text-3);
		font-weight: 700;
		font-size: 0.75rem;
	}

	.lb-name {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-1);
	}

	.lb-pack {
		font-size: 0.72rem;
		font-weight: 400;
		color: var(--text-3);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lb-score {
		text-align: right;
		font-size: 0.85rem;
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
