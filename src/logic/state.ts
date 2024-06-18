import GameSet from "../models/game_set";
import config from "../../config.json"
import Immutable from "immutable";
import type { State, Actions } from '../models/state';
import {actionsAreStartOfComboCheck} from './check';

export const EMPTY_STATE = "";

export const actionsToState = (actions: Actions): State => {
    return actions.join(config.splitter.keyMap)
}

export const stateToActions = (state: State): Actions => {
    if (state === EMPTY_STATE) return Immutable.List();
    return Immutable.List(state.split(config.splitter.keyMap))
}

export const cleantate = (gameset: Readonly<GameSet>) => (actions: Actions): State => {
    if (actions.count() === 1 || actionsAreStartOfComboCheck(gameset)(actions))
        return actionsToState(actions);
    return cleantate(gameset)(actions.pop());
}