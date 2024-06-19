import GameSet from "../models/game_set";
import { EMPTY_STATE, INITIAL_STATE, type State } from '../models/state';
import { actionAreComboCheck } from './check'
import { stateToActions, cleanState } from './state'

// DFSA is a Deterministic Finite State Automaton returning the next state from the current state and a key
const DFSA = (gameset: Readonly<GameSet>) => (state: State) => (key: string): State => {
    // ------------------------------------------------ undefined action
    const action = gameset.keyMaps.find((keyMap) => keyMap.key === key)?.action;
    if (action === undefined) return EMPTY_STATE;

    // ------------------------------------------------ check combo
    const actions = stateToActions(state).push(action);
    const combo = actionAreComboCheck(gameset)(actions);
    if (combo !== undefined) return combo;

    // ------------------------------------------------ clear state
    return cleanState(gameset)(actions);
}

export default DFSA;
