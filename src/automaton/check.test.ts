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
            { key: 'z', action: 'ACTION_Z' },
            { key: 'q', action: 'ACTION_Q' },
        ]),
        combos: Immutable.List<Combo>([
            { name: "COMBO_AB", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
            { name: "COMBO_BA", actions: Immutable.List(['ACTION_B', 'ACTION_A']) },
            { name: "COMBO_Z", actions: Immutable.List(['ACTION_Z']) },
            { name: "COMBO_Z_2", actions: Immutable.List(['ACTION_Z']) },
            { name: "COMBO_QA", actions: Immutable.List(['ACTION_Q', 'ACTION_A']) },
            { name: "COMBO_QA_2", actions: Immutable.List(['ACTION_Q', 'ACTION_A']) },
            { name: "COMBO_QA_3", actions: Immutable.List(['ACTION_Q', 'ACTION_A']) },
        ]),actionAreComboCheck
    };

    // ------------------------------------------------- no combo
    const noComboTests = [
            Immutable.List([]),
            Immutable.List(["ACTION_A"]),
            Immutable.List(["ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION"]),
            Immutable.List(["ACTION_A", "ACTION_A"]),
            Immutable.List(["ACTION_C", "ACTION_A"]),
            Immutable.List(["ACTION_C", "ACTION_A", "ACTION_B"]),
    ];

    for (const test of noComboTests) {
        const state: State = test.join(config.splitter.comboKeyMap);
        it(`no combo [${state}]`, () => {
            expect(actionAreComboCheck(gameset)(test).isEmpty()).toBeTruthy()
        });
    }

    // ------------------------------------------------- combo
    const comboTests = [
        {
            actions: Immutable.List(["ACTION_A", "ACTION_B"]),
            expectedComboLength: 1
        },
        {
            actions: Immutable.List(["ACTION_B", "ACTION_A"]),
            expectedComboLength: 1,
        },
        {
            actions: Immutable.List(["ACTION_Z"]),
            expectedComboLength: 2,
        },
        {
            actions: Immutable.List(["ACTION_Q", "ACTION_A"]),
            expectedComboLength: 3,
        },
    ];

    for (const test of comboTests) {
        const state: State = test.actions.join(config.splitter.comboKeyMap);
        it(`combo [${state}]`, () => {
            expect(actionAreComboCheck(gameset)(test.actions).count()).toBe(test.expectedComboLength);
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
            { name: "COMBO_ACAC", actions: Immutable.List(['ACTION_A', 'ACTION_C', 'ACTION_A', 'ACTION_C']) },
        ]),
    };

    // ------------------------------------------------- empty
    const comboTests = [
        Immutable.List([]),
        Immutable.List(["ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION"]),
        Immutable.List(["ACTION_A", "ACTION_A"]),
        Immutable.List(["ACTION_A", "ACTION_A", "ACTION_B"]),
    ];

    for (const test of comboTests) {
        const state: State = test.join(config.splitter.comboKeyMap);
        it(`false [${state}]`, () => {
            expect(actionsAreStartOfComboCheck(gameset)(test).isEmpty()).toBeTruthy();
        });
    }

    // ------------------------------------------------- no empty
    const noComboTests = [
        {
            actions: Immutable.List(["ACTION_A"]),
            expectedComboLength: 2,
        },
        {
            actions: Immutable.List(["ACTION_B"]),
            expectedComboLength: 1,
        },
        {
            actions: Immutable.List(["ACTION_A", "ACTION_B"]),
            expectedComboLength: 1,
        },
    ];

    for (const test of noComboTests) {
        const state: State = test.actions.join(config.splitter.comboKeyMap);
        it(`true [${state}]`, () => {
            expect(actionsAreStartOfComboCheck(gameset)(test.actions).count()).toBe(test.expectedComboLength);
        });
    }
})