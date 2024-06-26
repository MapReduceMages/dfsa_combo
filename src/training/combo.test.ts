import { parseComboLine, parseComboPart } from './combo';
import Config from './../config.json';
import Combo from '../models/combo';
import Immutable from 'immutable';

describe('parseComboLine', () => {
    // ----------------------------------------------- skip
    it('empty', () => {
        expect(parseComboLine('')).toBeNull();
    });

    // ----------------------------------------------- valid line single key
    const validSingleKeyLines: Combo[] = [
        {
            name: 'a',
            actions: Immutable.List(['b']),
        },
        {
            name: 'b',
            actions: Immutable.List(['a']),
        },
        {
            name: 'super',
            actions: Immutable.List(['test']),
        },
        {
            name: 'longnamewithlotsofcharacters',
            actions: Immutable.List(['longkeymapkeyswithlotsofcharacters']),
        },
    ];

    let validSingleKeyLineIndex = 0;
    for (const validSingleKeyLine of validSingleKeyLines) {
        const computedValidSingleKeyLine = `${validSingleKeyLine.name}${Config.splitter.combo}${validSingleKeyLine.actions.get(0)}`;
        it(`single key: ${validSingleKeyLine.name}-${validSingleKeyLine.actions.get(0)}`, () => {
            expect(parseComboLine(computedValidSingleKeyLine)).toEqual(validSingleKeyLines[validSingleKeyLineIndex++]);
        });
    }

    let validSingleKeyUntrimLineIndex = 0;
    for (const validSingleKeyLine of validSingleKeyLines) {
        const computedValidSingleKeyLine = ` ${validSingleKeyLine.name} ${Config.splitter.combo} ${validSingleKeyLine.actions.get(0)} `;
        it(`single key (untrim): ${validSingleKeyLine.name}-${validSingleKeyLine.actions.get(0)}`, () => {
            expect(parseComboLine(computedValidSingleKeyLine)).toEqual(validSingleKeyLines[validSingleKeyUntrimLineIndex++]);
        });
    }

    // ----------------------------------------------- valid line multi key
    const validMultiKeyLines: Combo[] = [
        {
            name: 'a',
            actions: Immutable.List(['b', 'c']),
        },
        {
            name: 'c',
            actions: Immutable.List(['b', 'a']),
        },
        {
            name: 'super',
            actions: Immutable.List(['test', 'with', 'more', 'keys']),
        },
        {
            name: 'longnamewithlotsofcharacters',
            actions: Immutable.List(['longkeymapkeyswithlotsofcharacters', 'x', 'y', 'z']),
        },

    ];

    let validMultiKeyLineIndex = 0;
    for (const validMultiKeyLine of validMultiKeyLines) {
        const computedValidMultiKeyLine = `${validMultiKeyLine.name}${Config.splitter.combo}${validMultiKeyLine.actions.toArray().join(Config.splitter.comboKeyMap)}`;
        it(`single key: ${validMultiKeyLine.name}-${validMultiKeyLine.actions.get(0)}`, () => {
            expect(parseComboLine(computedValidMultiKeyLine)).toEqual(validMultiKeyLines[validMultiKeyLineIndex++]);
        });
    }

    let validMultiKeyUntrimLineIndex = 0;
    for (const validMultiKeyLine of validMultiKeyLines) {
        const computedValidMultiKeyLine = ` ${validMultiKeyLine.name} ${Config.splitter.combo} ${validMultiKeyLine.actions.toArray().join(" " + Config.splitter.comboKeyMap + " ")}`;
        it(`single key (untrim): ${validMultiKeyLine.name}-${validMultiKeyLine.actions.get(0)}`, () => {
            expect(parseComboLine(computedValidMultiKeyLine)).toEqual(validMultiKeyLines[validMultiKeyUntrimLineIndex++]);
        });
    }

    // ----------------------------------------------- invalid line
    const missingSideLines = [
        `${Config.splitter.combo}a`,
        `a${Config.splitter.combo}`,
    ];

    for (const missingSideLine of missingSideLines) {
        it(`missing side: ${missingSideLine}`, () => {
            expect(parseComboLine(missingSideLine)).toBeInstanceOf(Error);
        });
    }

    it(`no separator`, () => {
        expect(parseComboLine('abcd')).toBeInstanceOf(Error);
    });

    const toManySideLines = [
        `${Config.splitter.combo}a${Config.splitter.combo}b${Config.splitter.combo}`,
        `${Config.splitter.combo}a${Config.splitter.combo}b${Config.splitter.combo}c`,
        `${Config.splitter.combo}a${Config.splitter.combo}b${Config.splitter.combo}c${Config.splitter.combo}`,
        `${Config.splitter.combo}a${Config.splitter.combo}b${Config.splitter.combo}c${Config.splitter.combo}d`,
    ];

    for (const toManySideLine of toManySideLines) {
        it(`to many side: ${toManySideLine}`, () => {
            expect(parseComboLine(toManySideLine)).toBeInstanceOf(Error);
        });
    }

    const emptyRightSideKeyMapLines = [
        `a${Config.splitter.combo}b${Config.splitter.comboKeyMap}`,
        `a${Config.splitter.combo}b${Config.splitter.comboKeyMap}c${Config.splitter.comboKeyMap}`,
    ];

    for (const emptyRightSideKeyMapLine of emptyRightSideKeyMapLines) {
        it(`empty right side key map: ${emptyRightSideKeyMapLine}`, () => {
            expect(parseComboLine(emptyRightSideKeyMapLine)).toBeInstanceOf(Error);
        });
    }
});

describe('parseComboPart', () => {
    // ----------------------------------------------- valid part
    const validComboParts: Combo[][] = [
        [
            {
                name: 'a',
                actions: Immutable.List(['b']),
            },
            {
                name: 'b',
                actions: Immutable.List(['a']),
            },
            {
                name: 'super',
                actions: Immutable.List(['test']),
            },
            {
                name: 'longnamewithlotsofcharacters',
                actions: Immutable.List(['longkeymapkeyswithlotsofcharacters']),
            },
        ],
        [
            {
                name: 'a',
                actions: Immutable.List(['b', 'c']),
            },
            {
                name: 'c',
                actions: Immutable.List(['b', 'a']),
            },
            {
                name: 'super',
                actions: Immutable.List(['test', 'with', 'more', 'keys']),
            },
            {
                name: 'longnamewithlotsofcharacters',
                actions: Immutable.List(['longkeymapkeyswithlotsofcharacters', 'x', 'y', 'z']),
            },
        ],
    ];

    let validComboPartIndex = 0;
    let testIndexLabel = 0;
    for (const validComboPart of validComboParts) {
        const computedValidComboPart = validComboPart.map((combo) => `${combo.name}${Config.splitter.combo}${combo.actions.toArray().join(Config.splitter.comboKeyMap)}`).join('\n');
        it(`valid combo part ${testIndexLabel++}`, () => {
            expect(parseComboPart(computedValidComboPart)).toEqual(Immutable.List(validComboParts[validComboPartIndex++]));
        });
    }

    let validComboPartWithEmptyLinesIndex = 0;
    testIndexLabel = 0;
    for (const validComboPart of validComboParts) {
        const computedValidComboPartWithEmptyLines = "\n" + validComboPart.map((combo) => `${combo.name}${Config.splitter.combo}${combo.actions.toArray().join(Config.splitter.comboKeyMap)}`).join('\n\n');
        it(`valid combo part ${testIndexLabel++}`, () => {
            expect(parseComboPart(computedValidComboPartWithEmptyLines)).toEqual(Immutable.List(validComboParts[validComboPartWithEmptyLinesIndex++]));
        });
    }

    // ----------------------------------------------- invalid part
    const emptyComboPart = '';

    it('empty', () => {
        expect(parseComboPart(emptyComboPart)).toBeInstanceOf(Error);
    });

    const missingSideComboParts = [
        'a',
        'a\n',
        'a\nb',
        'a\nb\nc',
        `a${Config.splitter.combo}`,
        `a${Config.splitter.combo}\n`,
        `a${Config.splitter.combo}\nb${Config.splitter.combo}`,
        `a${Config.splitter.combo}\nb${Config.splitter.combo}\nc${Config.splitter.combo}`,
        `${Config.splitter.combo}a`,
        `${Config.splitter.combo}a\n`,
        `${Config.splitter.combo}a\n${Config.splitter.combo}b`,
        `${Config.splitter.combo}a\n${Config.splitter.combo}b\n${Config.splitter.combo}c`,
    ];

    for (const missingSideComboPart of missingSideComboParts) {
        it(`missing side: ${missingSideComboPart.replace(new RegExp("\n", 'g'), " / ")}`, () => {
            expect(parseComboPart(missingSideComboPart)).toBeInstanceOf(Error);
        });
    }

    it("all missing sides", () => {
        expect(parseComboPart(missingSideComboParts.join("\n"))).toBeInstanceOf(Error);
    })

    const emptyRightSideKeyMapLines = [
        `a${Config.splitter.combo}b${Config.splitter.comboKeyMap}`,
        `a${Config.splitter.combo}b${Config.splitter.comboKeyMap}c${Config.splitter.comboKeyMap}`,
    ];

    for (const emptyRightSideKeyMapLine of emptyRightSideKeyMapLines) {
        it(`empty right side key map: ${emptyRightSideKeyMapLine}`, () => {
            expect(parseComboPart(emptyRightSideKeyMapLine)).toBeInstanceOf(Error);
        });
    }

    it("all empty right side key map", () => {
        expect(parseComboPart(emptyRightSideKeyMapLines.join("\n"))).toBeInstanceOf(Error);
    });

    testIndexLabel = 0;
    for (const invalidCorruptedMissingSideComboPart of validComboParts) {
        const computedinValidCorruptedMissingSideComboPart = invalidCorruptedMissingSideComboPart.map((combo) => `${combo.name}${Config.splitter.combo}${combo.actions.toArray().join(Config.splitter.comboKeyMap)}`).join('\n') + "\n" + missingSideComboParts[0] + "\n";
        it(`corrupted combo part (missing side) ${testIndexLabel++}`, () => {
            expect(parseComboPart(computedinValidCorruptedMissingSideComboPart)).toBeInstanceOf(Error);
        });
    }

    testIndexLabel = 0;
    for (const invalidCorruptedEmtpyRightSideKeyMapComboPart of validComboParts) {
        const computedinValidCorruptedEmtpyRightSideKeyMapComboPart = invalidCorruptedEmtpyRightSideKeyMapComboPart.map((combo) => `${combo.name}${Config.splitter.combo}${combo.actions.toArray().join(Config.splitter.comboKeyMap)}`).join('\n') + "\n" + emptyRightSideKeyMapLines[0] + "\n";
        it(`corrupted combo part (missing right side key map) ${testIndexLabel++}`, () => {
            expect(parseComboPart(computedinValidCorruptedEmtpyRightSideKeyMapComboPart)).toBeInstanceOf(Error);
        });
    }
});
