import { INITIAL_STATE, EMPTY_STATE } from '../models/state';
import DFSA from './DFSA';
import config from "../../config.json"
import Immutable from 'immutable';
import GameSet from '../models/game_set';
import KeyMap from '../models/key_map';
import Combo from '../models/combo';

describe('DFSA', () => {
    const gameset: GameSet = <GameSet>{
        keyMaps: Immutable.List<KeyMap>([
            { key: 'a', action: 'ACTION_A' },
            { key: 'b', action: 'ACTION_B' },
            { key: 'c', action: 'ACTION_C' },
            { key: 'l', action: 'ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION' },
            { key: 'q', action: 'ACTION_Q' },
        ]),
        combos: Immutable.List<Combo>([
            { name: "COMBO_AB", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
            { name: "COMBO_BA", actions: Immutable.List(['ACTION_B', 'ACTION_A']) },
            { name: "COMBO_CAB", actions: Immutable.List(['ACTION_C', 'ACTION_A', 'ACTION_B']) },
            { name: "COMBO_Q", actions: Immutable.List(['ACTION_Q']) },
        ]),
    };

    // ------------------------------------------------- undefined action
    const undefinedActionTest = [
        {
            state: INITIAL_STATE,
            key: 'x',
        },
        {
            state: Immutable.List(["ACTION_A"]).join(config.splitter.comboKeyMap),
            key: 'y',
        },
        {
            state: Immutable.List(["ACTION_A", "ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION"]).join(config.splitter.comboKeyMap),
            key: 'z',
        },
    ]

    for (const test of undefinedActionTest) {
        it(`undefined action [${test.state}] + [${test.key}] to [${EMPTY_STATE}]`, () => {
            expect(DFSA(gameset)(test.state)(test.key)).toBe(EMPTY_STATE)
        });
    }

    // ------------------------------------------------- to one action
    const toOneActionTest = [
        {
            state: INITIAL_STATE,
            key: 'a',
            expected: "ACTION_A",
        },
        {
            state: EMPTY_STATE,
            key: 'a',
            expected: "ACTION_A",
        },
        {
            state: "ACTION_A",
            key: 'a',
            expected: "ACTION_A",
        },
        {
            state: Immutable.List(["ACTION_A", "ACTION_C"]).join(config.splitter.comboKeyMap),
            key: 'b',
            expected: "ACTION_B"
        },
        {
            state: Immutable.List(["ACTION_C", "ACTION_A", "ACTION_C"]).join(config.splitter.comboKeyMap),
            key: 'b',
            expected: "ACTION_B"
        },
        {
            state: Immutable.List(["ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION", "ACTION_C", "ACTION_A", "ACTION_C"]).join(config.splitter.comboKeyMap),
            key: 'b',
            expected: "ACTION_B"
        }
    ];

    for (const test of toOneActionTest) {
        it(`to one action [${test.state}] + [${test.key}] to [${test.expected}]`, () => {
            expect(DFSA(gameset)(test.state)(test.key)).toBe(test.expected)
        });
    }

    // ------------------------------------------------- to empty
    const toEmptyTest = [
        {
            state: INITIAL_STATE,
            key: 'x',
        },
        {
            state: EMPTY_STATE,
            key: 'y',
        },
        {
            state: "ACTION_A",
            key: 'z',
        },
        {
            state: Immutable.List(["ACTION_A", "ACTION_C"]).join(config.splitter.comboKeyMap),
            key: '1',
        },
        {
            state: Immutable.List(["ACTION_C", "ACTION_A", "ACTION_C"]).join(config.splitter.comboKeyMap),
            key: '@',
        },
        {
            state: Immutable.List(["ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION", "ACTION_C", "ACTION_A", "ACTION_C"]).join(config.splitter.comboKeyMap),
            key: '!',
        }
    ];

    for (const test of toEmptyTest) {
        it(`to on action [${test.state}] + [${test.key}] to [${EMPTY_STATE}]`, () => {
            expect(DFSA(gameset)(test.state)(test.key)).toBe(EMPTY_STATE)
        });
    }

    // ------------------------------------------------- to start of combo
    const toStartOfComboTests = [
        {
            state: Immutable.List(["ACTION_A", "ACTION_C"]).join(config.splitter.comboKeyMap),
            key: 'a',
            expected: Immutable.List(["ACTION_C", "ACTION_A"]).join(config.splitter.comboKeyMap),
        },
        {
            state: Immutable.List(["ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION", "ACTION_A", "ACTION_C"]).join(config.splitter.comboKeyMap),
            key: 'a',
            expected: Immutable.List(["ACTION_C", "ACTION_A"]).join(config.splitter.comboKeyMap),
        },
        {
            state: Immutable.List(["ACTION_B", "ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION", "ACTION_A", "ACTION_C"]).join(config.splitter.comboKeyMap),
            key: 'a',
            expected: Immutable.List(["ACTION_C", "ACTION_A"]).join(config.splitter.comboKeyMap),
        },
    ];

    for (const test of toStartOfComboTests) {
        it(`to start of combo [${test.state}] + [${test.key}] to [${test.expected}]`, () => {
            expect(DFSA(gameset)(test.state)(test.key)).toBe(test.expected)
        });
    }

    // ------------------------------------------------- to combo
    const toComboTests = [
        {
            state: INITIAL_STATE,
            key: 'q',
            expected: "COMBO_Q"
        },
        {
            state: EMPTY_STATE,
            key: 'q',
            expected: "COMBO_Q"
        },
        {
            state: Immutable.List(["ACTION_A"]).join(config.splitter.comboKeyMap),
            key: 'b',
            expected: "COMBO_AB"
        },
        {
            state: Immutable.List(["ACTION_B"]).join(config.splitter.comboKeyMap),
            key: 'a',
            expected: "COMBO_BA"
        },
        {
            state: Immutable.List(["ACTION_C", "ACTION_A"]).join(config.splitter.comboKeyMap),
            key: 'b',
            expected: "COMBO_CAB"
        },
    ];

    for (const test of toComboTests) {
        it(`to combo [${test.state}] + [${test.key}] to [${test.expected}]`, () => {
            expect(DFSA(gameset)(test.state)(test.key)).toBe(test.expected)
        });
    }
})
