import { parseKeyMapLine, parseKeyMapPart } from './key_map';
import Config from './../config.json';
import KeyMap from '../models/key_map';
import Immutable from 'immutable';

describe('parseKeyMapLine', () => {
    // ----------------------------------------------- skip
    it('empty', () => {
        expect(parseKeyMapLine('')).toBeNull();
    });

    // ----------------------------------------------- valid line single key
    const validSingleKeyLines: KeyMap[] = [
        {
            key: 'a',
            action: 'b',
        },
        {
            key: 'b',
            action: 'a',
        },
        {
            key: 'super',
            action: 'test',
        },
        {
            key: 'longnamewithlotsofcharacters',
            action: 'longkeymapkeyswithlotsofcharacters',
        },
    ];

    let validSingleKeyLineIndex = 0;
    for (const validSingleKeyLine of validSingleKeyLines) {
        const computedValidSingleKeyLine = `${validSingleKeyLine.key}${Config.splitter.keyMap}${validSingleKeyLine.action}`;
        it(`single key: ${validSingleKeyLine.key}-${validSingleKeyLine.action}`, () => {
            expect(parseKeyMapLine(computedValidSingleKeyLine)).toEqual(validSingleKeyLines[validSingleKeyLineIndex++]);
        });
    }

    let validSingleKeyUntrimLineIndex = 0;
    for (const validSingleKeyLine of validSingleKeyLines) {
        const computedValidSingleKeyLine = ` ${validSingleKeyLine.key} ${Config.splitter.keyMap} ${validSingleKeyLine.action} `;
        it(`single key (untrim): ${validSingleKeyLine.key}-${validSingleKeyLine.action}`, () => {
            expect(parseKeyMapLine(computedValidSingleKeyLine)).toEqual(validSingleKeyLines[validSingleKeyUntrimLineIndex++]);
        });
    }

    // ----------------------------------------------- invalid line
    const missingSideLines = [
        `${Config.splitter.keyMap}a`,
        `a${Config.splitter.keyMap}`,
    ];

    for (const missingSideLine of missingSideLines) {
        it(`missing side: ${missingSideLine}`, () => {
            expect(parseKeyMapLine(missingSideLine)).toBeInstanceOf(Error);
        });
    }

    it(`no separator`, () => {
        expect(parseKeyMapLine('abcd')).toBeInstanceOf(Error);
    });

    const toManySideLines = [
        `${Config.splitter.keyMap}a${Config.splitter.keyMap}b${Config.splitter.keyMap}`,
        `${Config.splitter.keyMap}a${Config.splitter.keyMap}b${Config.splitter.keyMap}c`,
        `${Config.splitter.keyMap}a${Config.splitter.keyMap}b${Config.splitter.keyMap}c${Config.splitter.keyMap}`,
        `${Config.splitter.keyMap}a${Config.splitter.keyMap}b${Config.splitter.keyMap}c${Config.splitter.keyMap}d`,
    ];

    for (const toManySideLine of toManySideLines) {
        it(`to many side: ${toManySideLine}`, () => {
            expect(parseKeyMapLine(toManySideLine)).toBeInstanceOf(Error);
        });
    }
});

describe('parseKeyMapPart', () => {
    // ----------------------------------------------- valid part
    const validKeyMaps: KeyMap[][] = [
        [
            {
                key: 'a',
                action: 'b',
            },
            {
                key: 'b',
                action: 'a',
            },
            {
                key: 'super',
                action: 'test',
            },
            {
                key: 'longnamewithlotsofcharacters',
                action: 'longkeymapkeyswithlotsofcharacters',
            },
        ],
    ];

    let validKeyMapIndex = 0;
    let testIndexLabel = 0;
    for (const validKeyMap of validKeyMaps) {
        const computedValidKeyMap = validKeyMap.map((combo) => `${combo.key}${Config.splitter.keyMap}${combo.action}`).join('\n');
        it(`valid combo part ${testIndexLabel++}`, () => {
            expect(parseKeyMapPart(computedValidKeyMap)).toEqual(Immutable.List(validKeyMaps[validKeyMapIndex++]));
        });
    }

    let validKeyMapWithEmptyLinesIndex = 0;
    testIndexLabel = 0;
    for (const validKeyMap of validKeyMaps) {
        const computedValidKeyMapWithEmptyLines = "\n" + validKeyMap.map((combo) => `${combo.key}${Config.splitter.keyMap}${combo.action}`).join('\n\n');
        it(`valid combo part ${testIndexLabel++}`, () => {
            expect(parseKeyMapPart(computedValidKeyMapWithEmptyLines)).toEqual(Immutable.List(validKeyMaps[validKeyMapWithEmptyLinesIndex++]));
        });
    }

    // ----------------------------------------------- invalid part
    const emptyKeyMap = '';

    it('empty', () => {
        expect(parseKeyMapPart(emptyKeyMap)).toBeInstanceOf(Error);
    });

    const missingSideKeyMaps = [
        'a',
        'a\n',
        'a\nb',
        'a\nb\nc',
        `a${Config.splitter.keyMap}`,
        `a${Config.splitter.keyMap}\n`,
        `a${Config.splitter.keyMap}\nb${Config.splitter.keyMap}`,
        `a${Config.splitter.keyMap}\nb${Config.splitter.keyMap}\nc${Config.splitter.keyMap}`,
        `${Config.splitter.keyMap}a`,
        `${Config.splitter.keyMap}a\n`,
        `${Config.splitter.keyMap}a\n${Config.splitter.keyMap}b`,
        `${Config.splitter.keyMap}a\n${Config.splitter.keyMap}b\n${Config.splitter.keyMap}c`,
    ];

    for (const missingSideKeyMap of missingSideKeyMaps) {
        it(`missing side: ${missingSideKeyMap.replace(new RegExp("\n", 'g'), " / ")}`, () => {
            expect(parseKeyMapPart(missingSideKeyMap)).toBeInstanceOf(Error);
        });
    }

    it("all missing sides", () => {
        expect(parseKeyMapPart(missingSideKeyMaps.join("\n"))).toBeInstanceOf(Error);
    })

    testIndexLabel = 0;
    for (const invalidCorruptedMissingSideKeyMap of validKeyMaps) {
        const computedinValidCorruptedMissingSideKeyMap = invalidCorruptedMissingSideKeyMap.map((combo) => `${combo.key}${Config.splitter.keyMap}${combo.action}`).join('\n') + "\n" + missingSideKeyMaps[0] + "\n";
        it(`corrupted combo part (missing side) ${testIndexLabel++}`, () => {
            expect(parseKeyMapPart(computedinValidCorruptedMissingSideKeyMap)).toBeInstanceOf(Error);
        });
    }
});
