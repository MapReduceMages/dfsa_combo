import GameSet from "../models/game_set";
import config from "../../config.json"
import Immutable from "immutable";
import type { State, Actions } from '../models/state';
import {actionsAreStartOfComboCheck} from './check';

export const EMPTY_STATE = "";

// actionsToState converts a list of actions to a state
export const actionsToState = (actions: Actions): State => {
    return actions.join(config.splitter.keyMap)
}

// stateToActions converts a state to a list of actions
export const stateToActions = (state: State): Actions => {
    if (state === EMPTY_STATE) return Immutable.List();
    return Immutable.List(state.split(config.splitter.keyMap))
}

// cleanState pop the actions from the state until it is the start of a combo
export const cleanState = (gameset: Readonly<GameSet>) => (actions: Actions): State => {
    if (actions.count() === 1 || actionsAreStartOfComboCheck(gameset)(actions))
        return actionsToState(actions);
    return cleanState(gameset)(actions.pop());
}