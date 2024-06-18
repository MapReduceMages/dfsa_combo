import GameSet from "../models/game_set";
import type { State } from '../models/state';
import { actionAreComboCheck } from './check'
import { stateToActions, cleantate, EMPTY_STATE} from './state'

const DFSA = (gameset: Readonly<GameSet>) => (state: State) => (key: string): State => {
    // ------------------------------------------------ undefined action
    const action = gameset.keyMaps.find((keyMap) => keyMap.key === key)?.action;
    if (action === undefined) return EMPTY_STATE;

    // ------------------------------------------------ first action
    if (state === EMPTY_STATE) return action

    // ------------------------------------------------ check combo
    const actions = stateToActions(state).push(action);
    const combo = actionAreComboCheck(gameset)(actions);
    if (combo !== undefined) return combo;

    // ------------------------------------------------ clear state
    return cleantate(gameset)(actions);
}

export default DFSA;
