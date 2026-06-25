<script lang="ts">
	import { base } from '$app/paths';
	import type { Pack } from '$lib/packs';
	import { addScore } from '$lib/leaderboard';

	let { data } = $props();
	const pack = $derived<Pack>(data.pack);

	let index = $state(0);
	let selected = $state<number | null>(null);
	let answers = $state<number[]>([]);
	let step = $state<'quiz' | 'name' | 'result'>('quiz');
	let playerName = $state('');
	let rank = $state<number | null>(null);

	const question = $derived(pack.questions[index]);
	const isCorrect = $derived(selected !== null && selected === question.correctIndex);
	const score = $derived(
		answers.filter((a: number, i: number) => a === pack.questions[i].correctIndex).length
	);

	function choose(i: number) {
		if (selected !== null) return;
		selected = i;
	}

	function next() {
		if (selected === null) return;
		answers = [...answers, selected];
		if (index + 1 >= pack.questions.length) {
			step = 'name';
		} else {
			index = index + 1;
			selected = null;
		}
	}

	function submitName() {
		const scores = addScore({
			name: playerName.trim() || 'Anonymous',
			packId: pack.id,
			packTitle: pack.title,
			score,
			total: pack.questions.length
		});
		const pct = score / pack.questions.length;
		rank = scores.findIndex((s) => s.score / s.total <= pct) + 1;
		step = 'result';
	}

	function skipName() {
		step = 'result';
	}

	function restart() {
		index = 0;
		selected = null;
		answers = [];
		step = 'quiz';
		playerName = '';
		rank = null;
	}
</script>

<div class="container">
	{#if step === 'quiz'}
		<div class="progress-row">
			<a class="back" href="{base}/">← All packs</a>
			<span class="progress">Question {index + 1} of {pack.questions.length}</span>
		</div>

		<h1 class="pack-title">{pack.title}</h1>

		<div class="question-card">
			<p class="prompt">{question.prompt}</p>

			<div class="choices">
				{#each question.choices as choice, i (i)}
					{@const showCorrect = selected !== null && i === question.correctIndex}
					{@const showWrong = selected === i && i !== question.correctIndex}
					<button
						type="button"
						class="choice"
						class:selected={selected === i}
						class:correct={showCorrect}
						class:wrong={showWrong}
						disabled={selected !== null}
						onclick={() => choose(i)}
					>
						<span class="letter">{String.fromCharCode(65 + i)}</span>
						<span class="choice-text">{choice}</span>
					</button>
				{/each}
			</div>

			{#if selected !== null}
				<div class="explanation" class:correct={isCorrect} class:wrong={!isCorrect}>
					<strong>{isCorrect ? 'Correct!' : 'Not quite.'}</strong>
					{question.explanation}
				</div>
				<button type="button" class="next" onclick={next}>
					{index + 1 >= pack.questions.length ? 'See your score' : 'Next question →'}
				</button>
			{/if}
		</div>

	{:else if step === 'name'}
		<div class="result-card">
			<p class="result-label">You scored</p>
			<p class="result-score">{score} <span class="of">/ {pack.questions.length}</span></p>
			<div class="name-prompt">
				<p class="name-label">Add your name to the leaderboard</p>
				<form onsubmit={(e) => { e.preventDefault(); submitName(); }}>
					<input
						class="name-input"
						type="text"
						placeholder="Your name"
						maxlength="32"
						bind:value={playerName}
						autofocus
					/>
					<div class="name-actions">
						<button type="submit" class="primary">Add to leaderboard</button>
						<button type="button" class="skip" onclick={skipName}>Skip</button>
					</div>
				</form>
			</div>
		</div>

	{:else}
		<div class="result-card">
			<p class="result-label">You scored</p>
			<p class="result-score">{score} <span class="of">/ {pack.questions.length}</span></p>
			{#if rank !== null}
				<p class="rank">#{rank} on the leaderboard</p>
			{/if}
			<p class="result-summary">
				{#if score === pack.questions.length}
					Perfect round. Send this pack to a friend who thinks they're better.
				{:else if score >= pack.questions.length * 0.7}
					Strong showing — try one of the other packs next.
				{:else if score >= pack.questions.length * 0.4}
					Not bad. Run it back.
				{:else}
					Rough one. The explanations are there for a reason — give it another go.
				{/if}
			</p>
			<div class="result-actions">
				<button type="button" class="primary" onclick={restart}>Play again</button>
				<a class="secondary" href="{base}/">Pick another pack</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 640px;
		margin: 0 auto;
		padding: 1rem 1.5rem 3rem;
	}

	.progress-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		font-size: 0.85rem;
	}

	.back {
		color: var(--accent);
		text-decoration: none;
		font-weight: 500;
	}

	.back:hover {
		text-decoration: underline;
	}

	.progress {
		color: var(--text-3);
	}

	.pack-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-3);
		margin: 0 0 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.question-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.75rem;
	}

	.prompt {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-1);
		margin: 0 0 1.5rem;
		line-height: 1.4;
	}

	.choices {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.choice {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		text-align: left;
		padding: 0.875rem 1rem;
		border: 1.5px solid var(--border);
		border-radius: 10px;
		background: var(--surface);
		font: inherit;
		font-size: 0.95rem;
		color: var(--text-1);
		cursor: pointer;
		transition: border-color 100ms ease, background 100ms ease, transform 100ms ease;
	}

	.choice:not(:disabled):hover {
		border-color: var(--accent);
		background: var(--surface-hover);
	}

	.choice:disabled {
		cursor: default;
	}

	.choice.correct {
		border-color: var(--correct);
		background: var(--correct-bg);
		color: var(--correct-text);
	}

	.choice.wrong {
		border-color: var(--wrong);
		background: var(--wrong-bg);
		color: var(--wrong-text);
	}

	.letter {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 6px;
		background: var(--letter-bg);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--text-2);
		flex-shrink: 0;
	}

	.choice.correct .letter {
		background: var(--correct);
		color: #fff;
	}

	.choice.wrong .letter {
		background: var(--wrong);
		color: #fff;
	}

	.choice-text {
		flex: 1;
	}

	.explanation {
		margin-top: 1.25rem;
		padding: 0.875rem 1rem;
		border-radius: 8px;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.explanation.correct {
		background: var(--correct-bg);
		color: var(--correct-text);
	}

	.explanation.wrong {
		background: var(--wrong-bg);
		color: var(--wrong-text);
	}

	.next {
		margin-top: 1rem;
		width: 100%;
		padding: 0.75rem 1rem;
		border: none;
		border-radius: 8px;
		background: var(--accent);
		color: #fff;
		font: inherit;
		font-weight: 600;
		font-size: 0.95rem;
		cursor: pointer;
		transition: background 100ms ease;
	}

	.next:hover {
		background: var(--accent-hover);
	}

	.result-card {
		text-align: center;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 3rem 2rem;
		margin-top: 1rem;
	}

	.result-label {
		color: var(--text-3);
		font-size: 0.9rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 0.5rem;
	}

	.result-score {
		font-size: 4rem;
		font-weight: 800;
		color: var(--accent);
		margin: 0;
		line-height: 1;
	}

	.result-score .of {
		color: var(--text-3);
		font-weight: 400;
		font-size: 2rem;
	}

	.rank {
		margin: 0.75rem 0 0;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--accent);
	}

	.name-prompt {
		margin-top: 2rem;
		text-align: left;
	}

	.name-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-2);
		margin: 0 0 0.75rem;
		text-align: center;
	}

	.name-input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1.5px solid var(--border);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text-1);
		font: inherit;
		font-size: 1rem;
		box-sizing: border-box;
		outline: none;
	}

	.name-input:focus {
		border-color: var(--accent);
	}

	.name-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 0.75rem;
		justify-content: center;
	}

	.result-summary {
		color: var(--text-2);
		font-size: 1rem;
		margin: 1.5rem auto 2rem;
		max-width: 36ch;
		line-height: 1.5;
	}

	.result-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
	}

	.primary,
	.secondary {
		padding: 0.75rem 1.25rem;
		border-radius: 8px;
		font: inherit;
		font-weight: 600;
		font-size: 0.95rem;
		cursor: pointer;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
	}

	.primary {
		background: var(--accent);
		color: #fff;
		border: none;
	}

	.primary:hover {
		background: var(--accent-hover);
	}

	.secondary {
		background: var(--surface);
		color: var(--accent);
		border: 1.5px solid var(--accent);
	}

	.secondary:hover {
		background: var(--surface-hover);
	}

	.skip {
		background: none;
		border: none;
		color: var(--text-3);
		font: inherit;
		font-size: 0.9rem;
		cursor: pointer;
		padding: 0.75rem 0.5rem;
	}

	.skip:hover {
		color: var(--text-2);
	}
</style>
