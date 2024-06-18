import GameSet from "../models/game_set";
import type { Actions } from '../models/state';

export const actionAreComboCheck = (gameset: Readonly<GameSet>) => (actions: Actions): string | undefined => {
    for (const combo of gameset.combos)
        if (combo.actions.equals(actions)) return combo.name;
}

export const actionsAreStartOfComboCheck = (gameset: Readonly<GameSet>) => (actions: Actions): boolean => {
    return gameset.combos
        .some(combo => actions
            .every((action, index) => action === combo.actions.get(index)))
}
