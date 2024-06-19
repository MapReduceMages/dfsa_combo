import GameSet from "../models/game_set";
import config from "../../config.json"
import Immutable from "immutable";
import { EMPTY_STATE, type State, type Actions } from '../models/state';
import { actionsAreStartOfComboCheck } from './check';

// actionsToState converts a list of actions to a state
export const actionsToState = (actions: Actions): State => {
    return actions.join(config.splitter.comboKeyMap)
}

// stateToActions converts a state to a list of actions
export const stateToActions = (state: State): Actions => {
    if (state === EMPTY_STATE) return Immutable.List();
    return Immutable.List(state.split(config.splitter.comboKeyMap))
}

// cleanState pop the actions from the state until it is the start of a combo
export const cleanState = (gameset: Readonly<GameSet>) => (actions: Actions): State => {
    if (actions.count() <= 1 || !actionsAreStartOfComboCheck(gameset)(actions).isEmpty()) return actionsToState(actions);
    return cleanState(gameset)(actions.shift());
}
