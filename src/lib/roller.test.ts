import { describe, expect, it } from 'vitest';
import { Roller } from './roller';

describe('Roller', () => {
	it('rolls dice correctly', () => {
		const roller = new Roller();

		const result = roller.rollDice(4);

		expect(result).toHaveLength(4);
		for (const die of result) {
			expect(die).toBeGreaterThanOrEqual(1);
			expect(die).toBeLessThanOrEqual(6);
		}
	});
});
