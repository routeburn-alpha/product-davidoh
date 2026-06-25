import { browser } from '$app/environment';

export interface ScoreEntry {
	name: string;
	packId: string;
	packTitle: string;
	score: number;
	total: number;
	playedAt: string;
}

const KEY = 'quizlab_leaderboard';

export function getScores(): ScoreEntry[] {
	if (!browser) return [];
	try {
		return JSON.parse(localStorage.getItem(KEY) ?? '[]');
	} catch {
		return [];
	}
}

export function addScore(entry: Omit<ScoreEntry, 'playedAt'>): ScoreEntry[] {
	const scores = getScores();
	scores.push({ ...entry, playedAt: new Date().toISOString() });
	scores.sort((a, b) => b.score / b.total - a.score / a.total || a.playedAt.localeCompare(b.playedAt));
	const trimmed = scores.slice(0, 100);
	localStorage.setItem(KEY, JSON.stringify(trimmed));
	return trimmed;
}
