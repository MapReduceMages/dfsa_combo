import { parseComboLine } from './combo';

describe('parseComboLine', () => {
    it('should return null if the line is empty', () => {
        const result = parseComboLine('');
        expect(result).toBeNull();
    });
});