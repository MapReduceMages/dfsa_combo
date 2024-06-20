import GameSet from "../models/game_set";
import config from "../../config.json"
import Immutable from "immutable";
import { EMPTY_STATE, type State, type Actions, INITIAL_STATE } from '../models/state';
import { actionAreComboCheck, actionsAreStartOfComboCheck } from './check';
import Combo from "../models/combo";
import { split } from "../utils/string";

// stateToActions converts a state to a list of actions
export const stateToActions = (gameset: Readonly<GameSet>) => (state: State): Actions => {
    if (state === EMPTY_STATE) return Immutable.List(); // empty state
    const comboActions = comboStateToActions(gameset)(state); // combo state
    if (!comboActions.isEmpty()) return comboActions;
    const actions = actionStateToActions(state) // action state
    return actions;
}

// ========================================================================= combos
// combosToState converts a list of combos to a state
export const combosToState = (combos: Immutable.List<Combo>): State => {
    return combos.map(combo => combo.name).join(config.splitter.comboKeyMap)
}

// stateToCombos converts a state to a list of combos
export const stateToCombos = (gameset: Readonly<GameSet>) => (state: State): Immutable.List<Combo> => {
    return Immutable.List(state.split(config.splitter.comboKeyMap))
        .map((combo) => gameset.combos.find((c) => c.name === combo))
        .filter((c) => c !== undefined) as Immutable.List<Combo>;
}

// comboToActions converts a combo to a list of its actions
export const comboStateToActions = (gameset: Readonly<GameSet>) => (state: State): Actions => {
    if (state === EMPTY_STATE || state === INITIAL_STATE) return Immutable.List();

    const firstStateElement = (Immutable.List(state.split(config.splitter.comboKeyMap))).first();
    if (firstStateElement === undefined) return Immutable.List();

    const firstCombo = gameset.combos.find((c) => c.name === firstStateElement);

    return firstCombo?.actions ?? Immutable.List();
}

// ========================================================================= actions
// actionsToState converts a list of actions to a state
export const actionsToState = (actions: Actions): State => {
    return actions.join(config.splitter.comboKeyMap)
}

// actionStateToActions converts a action state to a list of actions
export const actionStateToActions = (state: State): Actions => {
    if (state === EMPTY_STATE) return Immutable.List(); // empty state
    return Immutable.List(state.split(config.splitter.comboKeyMap))
}

// cleanState pop the actions from the state until it is the start of a combo
export const cleanState = (gameset: Readonly<GameSet>) => (actions: Actions): State => {
    if (actions.isEmpty()) return EMPTY_STATE;
    const combos = actionAreComboCheck(gameset)(actions);
    if (!combos.isEmpty()) return combosToState(combos);
    const startOfComboActions = actionsAreStartOfComboCheck(gameset)(actions)
    if (!startOfComboActions.isEmpty()) return actionsToState(actions);
    return cleanState(gameset)(actions.shift());
}
