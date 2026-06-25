import { describe, it, expect } from 'vitest';
import { getPack } from '../../packs';
import type { Pack } from '../../packs';

describe('world-cup-2026 pack', () => {
	it('loads the pack by id', () => {
		const pack = getPack('world-cup-2026');
		expect(pack).not.toBeNull();
	});

	it('has the correct metadata', () => {
		const pack = getPack('world-cup-2026') as Pack;
		expect(pack.id).toBe('world-cup-2026');
		expect(pack.category).toBe('Sports');
		expect(pack.title).toBeTruthy();
		expect(pack.description).toBeTruthy();
		expect((pack as any).coverEmoji).toBeTruthy();
		expect((pack as any).coverColor).toBeTruthy();
		expect((pack as any).addedAt).toBeTruthy();
	});

	it('has between 10 and 15 questions', () => {
		const pack = getPack('world-cup-2026') as Pack;
		expect(pack.questions.length).toBeGreaterThanOrEqual(10);
		expect(pack.questions.length).toBeLessThanOrEqual(15);
	});

	it('each question has required fields with valid values', () => {
		const pack = getPack('world-cup-2026') as Pack;
		for (const q of pack.questions) {
			expect(q.id).toBeTruthy();
			expect(q.prompt).toBeTruthy();
			expect(q.choices).toHaveLength(4);
			expect([0, 1, 2, 3]).toContain(q.correctIndex);
			expect([1, 2, 3]).toContain(q.difficulty);
			expect(q.explanation).toBeTruthy();
		}
	});

	it('question ids are unique', () => {
		const pack = getPack('world-cup-2026') as Pack;
		const ids = pack.questions.map((q) => q.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
