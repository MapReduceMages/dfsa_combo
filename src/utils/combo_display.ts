import type Combo from '../models/combo';

const comboDisplay = (keyMap: Immutable.List<Combo>) : string =>
    keyMap.reduce((acc, combo) => {
        return acc += `${combo.name} -> ${combo.actions.reduce(
            (acc, action) => acc += `${action}, `, ""
        )}\n`;
    }, "");

export default comboDisplay;