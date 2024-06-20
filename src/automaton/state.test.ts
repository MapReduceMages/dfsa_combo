import type { State, Actions } from '../models/state';
import { actionsToState, actionStateToActions, cleanState, combosToState, stateToCombos, comboStateToActions, stateToActions } from './state'
import config from "../../config.json"
import Immutable from 'immutable';
import GameSet from '../models/game_set';
import KeyMap from '../models/key_map';
import Combo from '../models/combo';

describe('stateToActions', () => {
    const gameset: GameSet = <GameSet>{
        keyMaps: Immutable.List<KeyMap>([
            { key: 'U', action: 'ACTION_U' },
            { key: 'a', action: 'ACTION_A' },
            { key: 'b', action: 'ACTION_B' },
            { key: 'c', action: 'ACTION_C' },
            { key: 'l', action: 'ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION' },
            { key: 'q', action: 'ACTION_Q' },
        ]),
        combos: Immutable.List<Combo>([
            { name: "COMBO_U", actions: Immutable.List(['ACTION_U']) },
            { name: "COMBO_U_2", actions: Immutable.List(['ACTION_U']) },
            { name: "COMBO_AB", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
            { name: "COMBO_AB_2", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
            { name: "COMBO_ABA", actions: Immutable.List(['ACTION_A', 'ACTION_B', 'ACTION_A']) },
            { name: "COMBO_ABAC", actions: Immutable.List(['ACTION_A', 'ACTION_B', 'ACTION_A', 'ACTION_C']) },
            { name: "COMBO_ABCC", actions: Immutable.List(['ACTION_A', 'ACTION_B', 'ACTION_C', 'ACTION_C']) },
            { name: "COMBO_BA", actions: Immutable.List(['ACTION_B', 'ACTION_A']) },
            { name: "COMBO_CAB", actions: Immutable.List(['ACTION_C', 'ACTION_A', 'ACTION_B']) },
            { name: "COMBO_Q", actions: Immutable.List(['ACTION_Q']) },
        ]),
    };

    const tests = [
        {
            state: Immutable.List([]).join(config.splitter.comboKeyMap),
            expected: Immutable.List([]).join(config.splitter.comboKeyMap),
        },
        // ------------ from action
        {
            state: Immutable.List(['ACTION_U']).join(config.splitter.comboKeyMap),
            expected: Immutable.List(['ACTION_U']).join(config.splitter.comboKeyMap),
        },
        {
            state: Immutable.List(['ACTION_U', 'ACTION_U']).join(config.splitter.comboKeyMap),
            expected: Immutable.List(['ACTION_U', 'ACTION_U']).join(config.splitter.comboKeyMap),
        },
        {
            state: Immutable.List(['ACTION_A', 'ACTION_B']).join(config.splitter.comboKeyMap),
            expected: Immutable.List(['ACTION_A', 'ACTION_B']).join(config.splitter.comboKeyMap),
        },
        // ------------ from combo
        {
            state: Immutable.List(['COMBO_U']).join(config.splitter.comboKeyMap),
            expected: Immutable.List(['ACTION_U']).join(config.splitter.comboKeyMap),
        },
        {
            state: Immutable.List(['COMBO_U', 'COMBO_U_2']).join(config.splitter.comboKeyMap),
            expected: Immutable.List(['ACTION_U']).join(config.splitter.comboKeyMap),
        },
        {
            state: Immutable.List(['COMBO_AB']).join(config.splitter.comboKeyMap),
            expected: Immutable.List(['ACTION_A', 'ACTION_B']).join(config.splitter.comboKeyMap),
        },
        {
            state: Immutable.List(['COMBO_AB', 'COMBO_AB_2']).join(config.splitter.comboKeyMap),
            expected: Immutable.List(['ACTION_A', 'ACTION_B']).join(config.splitter.comboKeyMap),
        },
        {
            state: Immutable.List(['COMBO_ABA']).join(config.splitter.comboKeyMap),
            expected: Immutable.List(['ACTION_A', 'ACTION_B', 'ACTION_A']).join(config.splitter.comboKeyMap),
        },
    ];

    for (const test of tests) {
        it(`[${test.expected}]`, () => {
            expect(stateToActions(gameset)(test.state).join(config.splitter.comboKeyMap)).toBe(test.expected);
        });
    }
})

// ========================================================================= combo
describe('combosToState', () => {
    const tests = [
        {
            combos: Immutable.List([
                <Combo>{ name: "COMBO_AB", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
            ]),
            expected: Immutable.List(['COMBO_AB']).join(config.splitter.comboKeyMap),
        },
        {
            combos: Immutable.List([
                <Combo>{ name: "COMBO_AB", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
                <Combo>{ name: "COMBO_BA", actions: Immutable.List(['ACTION_B', 'ACTION_A']) },
                <Combo>{ name: "COMBO_Z", actions: Immutable.List(['ACTION_Z']) },
            ]),
            expected: Immutable.List(['COMBO_AB', 'COMBO_BA', 'COMBO_Z']).join(config.splitter.comboKeyMap),
        },
        {
            combos: Immutable.List([
                <Combo>{ name: "COMBO_AB", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
                <Combo>{ name: "COMBO_BA", actions: Immutable.List(['ACTION_B', 'ACTION_A']) },
                <Combo>{ name: "COMBO_Z", actions: Immutable.List(['ACTION_Z']) },
                <Combo>{ name: "COMBO_Q", actions: Immutable.List(['ACTION_Q']) },
            ]),
            expected: Immutable.List(['COMBO_AB', 'COMBO_BA', 'COMBO_Z', 'COMBO_Q']).join(config.splitter.comboKeyMap),
        }
    ];

    for (const test of tests) {
        it(`[${test.expected}]`, () => {
            expect(combosToState(test.combos)).toBe(test.expected);
        });
    }
})

describe('stateToCombos', () => {
    const gameset: GameSet = <GameSet>{
        keyMaps: Immutable.List<KeyMap>([
            { key: 'a', action: 'ACTION_A' },
            { key: 'b', action: 'ACTION_B' },
            { key: 'c', action: 'ACTION_C' },
            { key: 'l', action: 'ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION' },
        ]),
        combos: Immutable.List<Combo>([
            { name: "COMBO_AB", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
            { name: "COMBO_AB2", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
            { name: "COMBO_BA", actions: Immutable.List(['ACTION_B', 'ACTION_A']) },
            { name: "COMBO_CAB", actions: Immutable.List(['ACTION_C', 'ACTION_A', 'ACTION_B']) },
        ]),
    };

    const tests = [
        {
            state: Immutable.List(['COMBO_AB']).join(config.splitter.comboKeyMap),
            expected: Immutable.List([
                <Combo>{ name: "COMBO_AB", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
            ]),
        },
        {
            state: Immutable.List(['COMBO_AB', 'COMBO_AB2']).join(config.splitter.comboKeyMap),
            expected: Immutable.List([
                <Combo>{ name: "COMBO_AB", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
                <Combo>{ name: "COMBO_AB2", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
            ]),
        },
        {
            state: Immutable.List(['COMBO_AB', 'COMBO_BA']).join(config.splitter.comboKeyMap),
            expected: Immutable.List([
                <Combo>{ name: "COMBO_AB", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
                <Combo>{ name: "COMBO_BA", actions: Immutable.List(['ACTION_B', 'ACTION_A']) },
            ]),
        },
        {
            state: Immutable.List(['COMBO_AB', 'COMBO_BA', 'COMBO_CAB']).join(config.splitter.comboKeyMap),
            expected: Immutable.List([
                <Combo>{ name: "COMBO_AB", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
                <Combo>{ name: "COMBO_BA", actions: Immutable.List(['ACTION_B', 'ACTION_A']) },
                <Combo>{ name: "COMBO_CAB", actions: Immutable.List(['ACTION_C', 'ACTION_A', 'ACTION_B']) },
            ]),
        }
    ];

    for (const test of tests) {
        it(`[${test.state}]`, () => {
            const results = stateToCombos(gameset)(test.state);
            for (let i = 0; i < results.count(); i++) {
                expect(results.get(i)).toEqual(test.expected.get(i));
            }
        });
    }
})

describe('comboStateToActions', () => {
    const gameset: GameSet = <GameSet>{
        keyMaps: Immutable.List<KeyMap>([
            { key: 'a', action: 'ACTION_A' },
            { key: 'b', action: 'ACTION_B' },
            { key: 'c', action: 'ACTION_C' },
            { key: 'l', action: 'ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION_LONG_ACTION' },
        ]),
        combos: Immutable.List<Combo>([
            { name: "COMBO_AB", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
            { name: "COMBO_AB2", actions: Immutable.List(['ACTION_A', 'ACTION_B']) },
        ]),
    };

    const tests = [
        {
            state: Immutable.List(['ACTION_A']).join(config.splitter.comboKeyMap),
            expected: Immutable.List(),
        },
        {
            state: Immutable.List(['COMBO_AB']).join(config.splitter.comboKeyMap),
            expected: Immutable.List(['ACTION_A', 'ACTION_B']),
        },
        {
            state: Immutable.List(['COMBO_AB2']).join(config.splitter.comboKeyMap),
            expected: Immutable.List(['ACTION_A', 'ACTION_B']),
        },
        {
            state: Immutable.List(['COMBO_AB', 'COMBO_AB2']).join(config.splitter.comboKeyMap),
            expected: Immutable.List(['ACTION_A', 'ACTION_B']),
        },
    ];

    for (const test of tests) {
        it(`[${test.state}]`, () => {
            const results = comboStateToActions(gameset)(test.state);
            for (let i = 0; i < results.count(); i++) {
                expect(results.get(i)).toEqual(test.expected.get(i));
            }
        });
    }
})


// ========================================================================= actions
describe('actionsToState', () => {
    const tests = [
        Immutable.List(['a', 'b']),
        Immutable.List(['a', 'b', 'c']),
        Immutable.List(['a']),
        Immutable.List([]),
    ];

    for (const test of tests) {
        const state: State = test.join(config.splitter.comboKeyMap);
        it(`[${state}]`, () => {
            expect(actionsToState(test)).toBe(state);
        });
    }
})

describe('actionStateToActions', () => {
    const tests: Actions[] = [
        Immutable.List(['a', 'b']),
        Immutable.List(['a', 'b', 'c']),
        Immutable.List(['a']),
        Immutable.List([]),
    ];

    for (const test of tests) {
        const state: State = test.join(config.splitter.comboKeyMap);
        it(`[${state}]`, () => {
            expect(actionStateToActions(state).equals(test)).toBeTruthy();
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

    const tests = [
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

    for (const test of tests) {
        it(`[${test.actions.join(config.splitter.comboKeyMap)}]`, () => {
            const state = actionsToState(test.actions);
            expect(cleanState(gameset)(test.actions)).toBe(test.expected);
        });
    }
})

