import Immutable from 'immutable';
import { trim, checkEmpty, split } from './string'

describe('trim', () => {
    // ----------------------------------------------- empty
    it('empty', () => {
        const result = trim("");
        expect(result).toEqual("");
    });

    // ----------------------------------------------- valid
    const tests = [
        {
            content: "a",
            expected: "a",
        },
        {
            content: " a",
            expected: "a",
        },
        {
            content: "a ",
            expected: "a",
        },
        {
            content: " a ",
            expected: "a",
        },
        {
            content: "  a  ",
            expected: "a",
        },
        {
            content: "  a  b  ",
            expected: "a  b",
        },
    ];

    for (const test of tests) {
        it(`valid: ${test.content}`, () => {
            expect(trim(test.content)).toEqual(test.expected);
        });
    }
});

describe('checkEmpty', () => {
    // ----------------------------------------------- empty
    it('empty', () => {
        const result = checkEmpty("");
        expect(result).toEqual(true);
    });

    it('undefined', () => {
        const result = checkEmpty(undefined);
        expect(result).toEqual(true);
    });

    it('empty array', () => {
        const result = checkEmpty([]);
        expect(result).toEqual(true);
    });

    it('empty list', () => {
        const result = checkEmpty(Immutable.List([]));
        expect(result).toEqual(true);
    });

    // ----------------------------------------------- not empty
    const tests = [
        "a",
        " ",
        "  ",
        ["a"],
        [" "],
        ["  "],
        Immutable.List(["a"]),
        Immutable.List([" "]),
        Immutable.List(["  "]),
    ];

    for (const test of tests) {
        it(`valid: ${test}`, () => {
            expect(checkEmpty(test)).toEqual(false);
        });
    }
});

describe('split', () => {
    // ----------------------------------------------- empty
    it('empty', () => {
        const result = split("a")("");
        expect(result).toEqual(Immutable.List([]));
    });

    // ----------------------------------------------- valid
    const tests = [
        {
            content: "a",
            separator: ".",
            expected: Immutable.List(["a"]),
        },
        {
            content: "a.b",
            separator: ".",
            expected: Immutable.List(["a", "b"]),
        },
        {
            content: "a.b.c",
            separator: ".",
            expected: Immutable.List(["a", "b", "c"]),
        },
        {
            content: "a....b.c",
            separator: ".",
            expected: Immutable.List(["a", "", "", "", "b", "c"]),
        },
        {
            content: ".a....b.c",
            separator: ".",
            expected: Immutable.List(["", "a", "", "", "", "b", "c"]),
        },
        {
            content: "..a....b.c",
            separator: ".",
            expected: Immutable.List(["", "", "a", "", "", "", "b", "c"]),
        },
        {
            content: "..a....b.c.",
            separator: ".",
            expected: Immutable.List(["", "", "a", "", "", "", "b", "c", ""]),
        },
        {
            content: "..a....b.c..",
            separator: ".",
            expected: Immutable.List(["", "", "a", "", "", "" ,"b", "c", "", ""]),
        },
    ];

    for (const test of tests) {
        it(`valid: ${test.content}`, () => {
            expect(split(test.separator)(test.content)).toEqual(test.expected);
        });
    }
});