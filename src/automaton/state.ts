import GameSet from "../models/game_set";
import config from "../../config.json"
import Immutable from "immutable";
import { EMPTY_STATE, type State, type Actions } from '../models/state';
import { actionsAreStartOfComboCheck } from './check';
import Combo from "../models/combo";
import { split } from "../utils/string";



// actionsToState converts a list of actions to a state
export const actionsToState = (actions: Actions): State => {
    return actions.join(config.splitter.comboKeyMap)
}

// stateToActions converts a state to a list of actions
export const stateToActions = (state: State): Actions => {
    if (state === EMPTY_STATE) return Immutable.List();
    return Immutable.List(state.split(config.splitter.comboKeyMap))
}

// combosToState converts a list of combos to a state
export const combosToState = (combos: Immutable.List<Combo>): State => {
    return combos.map(combo => combo.actions.join(config.splitter.multiCombo)).join(config.splitter.combo)
}

// stateToCombos converts a state to a list of combos
export const stateToCombos = (gameset: Readonly<GameSet>) => (state: State): Immutable.List<Combo> => {
    return split(state)(config.splitter.combo)
        .map((combo) => gameset.combos.find((c) => c.name === combo))
        .filter((c) => c !== undefined) as Immutable.List<Combo>;
}

// cleanState pop the actions from the state until it is the start of a combo
export const cleanState = (gameset: Readonly<GameSet>) => (actions: Actions): State => {
    if (actions.count() <= 1 || !actionsAreStartOfComboCheck(gameset)(actions).isEmpty()) return actionsToState(actions);
    return cleanState(gameset)(actions.shift());
}
