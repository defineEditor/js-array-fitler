import Filter from '../src/class/filter';
import { ColumnMetadataParsed } from '../src/interfaces/filter';

describe('validateFilterString', () => {
    const columns: ColumnMetadataParsed[] = [{
        name: 'name', dataType: 'string',
    }, {
        name: 'age', dataType: 'number',
    }, {
        name: 'isActive', dataType: 'boolean',
    }, {
        name: 'race', dataType: 'string',
    }];

    it('should return true for a valid filter string', () => {
        const filterString = 'name = "John" and age > 30';
        expect(new Filter('parsed',columns, '').validateFilterString(filterString)).toBe(
            true,
        );
    });

    it('should return false for an invalid filter string', () => {
        const filterString = 'name = "John" and age > "thirty"';
        expect(new Filter('parsed',columns, '').validateFilterString(filterString)).toBe(
            false,
        );
    });

    it('should return true for an empty filter string', () => {
        const filterString = '';
        expect(new Filter('parsed',columns, '').validateFilterString(filterString)).toBe(
            true,
        );
    });

    it('should return false for a filter string with an unknown column', () => {
        const filterString = 'unknown = "value"';
        expect(new Filter('parsed',columns, '').validateFilterString(filterString)).toBe(
            false,
        );
    });

    it('should return true for a valid filter string with IN clause', () => {
        const filterString = 'RACE in ("WHITE", "BLACKOR AFRICAN AMERICAN")';
        expect(new Filter('parsed',columns, '').validateFilterString(filterString)).toBe(
            true,
        );
    });

    it('should return false for an invalid filter string with variable name in incorrect case', () => {
        const filterString = 'RACE in ("WHITE", "BLACKOR AFRICAN AMERICAN")';
        expect(new Filter('parsed',columns, '', { caseInsensitiveColNames: false }).validateFilterString(filterString)).toBe(
            false,
        );
    });
    it('should return true for an function', () => {
        const filterString = 'notMissing(RACE)';
        expect(new Filter('parsed',columns, '', { caseInsensitiveColNames: false }).validateFilterString(filterString)).toBe(
            false,
        );
    });
    it('should return true for an function in multiple conditions', () => {
        const filterString = 'age in (13, 14) and notMissing(RACE) or isActive = true';
        expect(new Filter('parsed',columns, '').validateFilterString(filterString)).toBe(
            true,
        );
    });

    it('should return false for a completely incorrect filter string', () => {
        const filterString = 'completely incorrect filter string';
        expect(new Filter('parsed', columns, '').validateFilterString(filterString)).toBe(
            false,
        );
    });

    it('should return false for an incomplete filter string', () => {
        const filterString = 'age eq';
        expect(new Filter('parsed', columns, '').validateFilterString(filterString)).toBe(
            false,
        );
    });
});
