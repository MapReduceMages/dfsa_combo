import type { State, Actions } from '../models/state';
import { actionsToState, stateToActions, cleantate } from './state'
import config from "../../config.json"
import Immutable from 'immutable';

describe('actionsToState', () => {
    const validTests = [
        Immutable.List(['a', 'b']),
        Immutable.List(['a', 'b', 'c']),
        Immutable.List(['a']),
        Immutable.List([]),
    ];

    for (const test of validTests) {
        const state: State = test.join(config.splitter.keyMap);
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
        const state: State = test.join(config.splitter.keyMap);
        it(`[${state}]`, () => {
            expect(stateToActions(state).equals(test)).toBeTruthy();
        });
    }
})

// describe('cleantate', () => {
    // TODO
// })