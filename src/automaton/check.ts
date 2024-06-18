import GameSet from "../models/game_set";
import type { Actions } from '../models/state';

// actionAreComboCheck checks if the actions are a combo from the gameset
export const actionAreComboCheck = (gameset: Readonly<GameSet>) => (actions: Actions): string | undefined => {
    for (const combo of gameset.combos)
        if (combo.actions.equals(actions)) return combo.name;
}

// actionsAreStartOfComboCheck checks if the actions are the start of a combo from the gameset
export const actionsAreStartOfComboCheck = (gameset: Readonly<GameSet>) => (actions: Actions): boolean => {
    if (actions.isEmpty()) return false;
    return gameset.combos
        .some(combo => actions
            .every((action, index) => action === combo.actions.get(index)))
}
