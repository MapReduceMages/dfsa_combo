import type { State, Actions } from '../models/state';
import { actionsToState, stateToActions, cleanState } from './state'
import config from "../../config.json"
import Immutable from 'immutable';
import GameSet from '../models/game_set';
import KeyMap from '../models/key_map';
import Combo from '../models/combo';

describe('actionsToState', () => {
    const validTests = [
        Immutable.List(['a', 'b']),
        Immutable.List(['a', 'b', 'c']),
        Immutable.List(['a']),
        Immutable.List([]),
    ];

    for (const test of validTests) {
        const state: State = test.join(config.splitter.comboKeyMap);
        it(`[${state}]`, () => {
            expect(actionsToState(test)).toBe(state);
        });
    }
})

describe('stateToActions', () => {
    const validTests: Actions[] = [
        Immutable.List(['a', 'b']),
        Immutable.List(['a', 'b', 'c']),
        Immutable.List(['a']),
        Immutable.List([]),
    ];

    for (const test of validTests) {
        const state: State = test.join(config.splitter.comboKeyMap);
        it(`[${state}]`, () => {
            expect(stateToActions(state).equals(test)).toBeTruthy();
        });
    }
})

describe('cleanState', () => {
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

    const validTests = [
        {
            actions: Immutable.List([]),
            expected: "",
        },
        {
            actions: Immutable.List(['ACTION_A']),
            expected: Immutable.List(['ACTION_A']).join(config.splitter.comboKeyMap),
        },
        {
            actions: Immutable.List(['ACTION_A', 'ACTION_A']),
            expected: Immutable.List(['ACTION_A']).join(config.splitter.comboKeyMap),
        },
        {
            actions: Immutable.List(['ACTION_C', 'ACTION_B', 'ACTION_A']),
            expected: Immutable.List(['ACTION_B', 'ACTION_A']).join(config.splitter.comboKeyMap),
        },
        {
            actions: Immutable.List(['ACTION_B', 'ACTION_C', 'ACTION_B', 'ACTION_A']),
            expected: Immutable.List(['ACTION_B', 'ACTION_A']).join(config.splitter.comboKeyMap),
        },
        {
            actions: Immutable.List(['ACTION_C', 'ACTION_A',]),
            expected: Immutable.List(['ACTION_C', 'ACTION_A']).join(config.splitter.comboKeyMap),
        },
        {
            actions: Immutable.List(['ACTION_C', 'ACTION_C', 'ACTION_A',]),
            expected: Immutable.List(['ACTION_C', 'ACTION_A']).join(config.splitter.comboKeyMap),
        },
        {
            actions: Immutable.List(['ACTION_B', 'ACTION_C', 'ACTION_C', 'ACTION_A',]),
            expected: Immutable.List(['ACTION_C', 'ACTION_A']).join(config.splitter.comboKeyMap),
        },
    ];

    for (const test of validTests) {
        it(`[${test.actions.join(config.splitter.comboKeyMap)}]`, () => {
            const state = actionsToState(test.actions);
            expect(cleanState(gameset)(test.actions)).toBe(test.expected);
        });
    }
})