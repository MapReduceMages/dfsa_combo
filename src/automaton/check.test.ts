import type { State, Actions } from '../models/state';
import { actionAreComboCheck, actionsAreStartOfComboCheck } from './check';
import config from "../../config.json"
import Immutable from 'immutable';
import GameSet from '../models/game_set';
import KeyMap from '../models/key_map';
import Combo from '../models/combo';

describe('actionAreComboCheck', () => {
    const gameset: GameSet = <GameSet>{
        keyMaps: Immutable.List<KeyMap>([
            { key: 'a', action: 'ACTION_A' },
            { key: 'b', action: 'ACTION_B' },
            { key: 'c', action: 'ACTION_C' },
            { key: 'l', action: 'ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION' },
        ]),
        combos: Immutable.List<Combo>([
            { name: "COMBO_AB", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
            { name: "COMBO_BA", actions: Immutable.List(['ACTION_B', 'ACTION_A']) },
        ]),
    };

    // ------------------------------------------------- no combo
    const noComboTests = [
        {
            actions: Immutable.List([]),
            expected: undefined,
        },
        {
            actions: Immutable.List(["ACTION_A"]),
            expected: undefined,
        },
        {
            actions: Immutable.List(["ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION"]),
            expected: undefined,
        },
        {
            actions: Immutable.List(["ACTION_A", "ACTION_A"]),
            expected: undefined,
        },
        {
            actions: Immutable.List(["ACTION_C", "ACTION_A"]),
            expected: undefined,
        },
        {
            actions: Immutable.List(["ACTION_C", "ACTION_A", "ACTION_B"]),
            expected: undefined,
        },
    ];

    for (const test of noComboTests) {
        const state: State = test.actions.join(config.splitter.comboKeyMap);
        it(`no combo [${state}]`, () => {
            expect(actionAreComboCheck(gameset)(test.actions)).toBe(test.expected);
        });
    }

    // ------------------------------------------------- combo
    const comboTests = [
        {
            actions: Immutable.List(["ACTION_A", "ACTION_B"]),
            expected: "COMBO_AB",
        },
        {
            actions: Immutable.List(["ACTION_B", "ACTION_A"]),
            expected: "COMBO_BA",
        },
    ];

    for (const test of comboTests) {
        const state: State = test.actions.join(config.splitter.comboKeyMap);
        it(`combo [${state}]`, () => {
            expect(actionAreComboCheck(gameset)(test.actions)).toBe(test.expected);
        });
    }
})

describe('actionsAreStartOfComboCheck', () => {
    const gameset: GameSet = <GameSet>{
        keyMaps: Immutable.List<KeyMap>([
            { key: 'a', action: 'ACTION_A' },
            { key: 'b', action: 'ACTION_B' },
            { key: 'c', action: 'ACTION_C' },
            { key: 'l', action: 'ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION' },
        ]),
        combos: Immutable.List<Combo>([
            { name: "COMBO_AB", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
            { name: "COMBO_BA", actions: Immutable.List(['ACTION_B', 'ACTION_A']) },
            { name: "COMBO_CAB", actions: Immutable.List(['ACTION_C', 'ACTION_A', 'ACTION_B']) },
        ]),
    };

    // ------------------------------------------------- false
    const comboTests = [
        Immutable.List([]),
        Immutable.List(["ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION"]),
        Immutable.List(["ACTION_A", "ACTION_A"]),
        Immutable.List(["ACTION_A", "ACTION_A", "ACTION_B"]),
    ];

    for (const test of comboTests) {
        const state: State = test.join(config.splitter.comboKeyMap);
        it(`false [${state}]`, () => {
            expect(actionsAreStartOfComboCheck(gameset)(test)).toBeFalsy();
        });
    }

    // ------------------------------------------------- true
    const noComboTests = [
        Immutable.List(["ACTION_A"]),
        Immutable.List(["ACTION_B"]),
        Immutable.List(["ACTION_A", "ACTION_B"]),
    ];

    for (const test of noComboTests) {
        const state: State = test.join(config.splitter.comboKeyMap);
        it(`true [${state}]`, () => {
            expect(actionsAreStartOfComboCheck(gameset)(test)).toBeTruthy();
        });
    }
})