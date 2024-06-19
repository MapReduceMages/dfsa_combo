import GameSet from "../models/game_set";
import type { Actions } from '../models/state';
import type Combo from "../models/combo";
import Immutable from "immutable";

// actionAreComboCheck checks if the actions are a combo from the gameset
export const actionAreComboCheck = (gameset: Readonly<GameSet>) => (actions: Actions): Immutable.List<Combo> => {
    return gameset.combos
        .filter(combo => actions.equals(combo.actions))
}

// actionsAreStartOfComboCheck checks if the actions are the start of a combo from the gameset
export const actionsAreStartOfComboCheck = (gameset: Readonly<GameSet>) => (actions: Actions): Immutable.List<Combo> => {
    if (actions.isEmpty()) return Immutable.List();
    return gameset.combos
        .filter(combo => actions
            .every((action, index) => action === combo.actions.get(index)))
}