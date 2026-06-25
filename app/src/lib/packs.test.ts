import { describe, it, expect } from 'vitest';
import { listPacks, getPack } from './packs';

describe('listPacks', () => {
	it('returns at least one pack', () => {
		const packs = listPacks();
		expect(packs.length).toBeGreaterThan(0);
	});

	it('includes the world-cup-2026 pack', () => {
		const packs = listPacks();
		const ids = packs.map((p) => p.id);
		expect(ids).toContain('world-cup-2026');
	});

	it('returns packs sorted by title', () => {
		const packs = listPacks();
		const titles = packs.map((p) => p.title);
		expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
	});

	it('each pack has required fields', () => {
		const packs = listPacks();
		for (const pack of packs) {
			expect(pack.id).toBeTruthy();
			expect(pack.title).toBeTruthy();
			expect(pack.category).toBeTruthy();
			expect(pack.description).toBeTruthy();
			expect(Array.isArray(pack.questions)).toBe(true);
			expect(pack.questions.length).toBeGreaterThan(0);
		}
	});
});

describe('getPack', () => {
	it('returns the world-cup-2026 pack by id', () => {
		const pack = getPack('world-cup-2026');
		expect(pack).not.toBeNull();
		expect(pack?.id).toBe('world-cup-2026');
		expect(pack?.title).toBe('World Cup 2026');
		expect(pack?.questions.length).toBeGreaterThanOrEqual(5);
	});

	it('returns null for unknown id', () => {
		expect(getPack('does-not-exist')).toBeNull();
	});
});
