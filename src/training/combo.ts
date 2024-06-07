
import Immutable from 'immutable';
import { checkEmpty, trim, split } from '../utils/string';
import Config from '../../config.json';
import type Combo from '../models/combo';

export const parseComboLine = (comboLine: string): Readonly<Combo> | null => {
    if (checkEmpty(comboLine)) return null;
    const trimedLine = trim(comboLine);
    const combo = split(trimedLine)(Config.splitter.combo);
    if (combo.count() !== 2) throw new Error('Combo line must have a combo key and one or more key map keys separated by a comma');
    const comboKey = combo.get(0);
    if (checkEmpty(comboKey)) throw new Error('Combo line must have a combo key');
    const comboKeyMaps = split(combo.get(1)!)(Config.splitter.comboKeyMap);
    if (checkEmpty(comboKeyMaps)) throw new Error('Combo line must have one or more key map keys separated by a comma');
    const keyMaps: string[] = Array<string>();
    for (const comboKeyMap of comboKeyMaps) {
        if (checkEmpty(comboKeyMap)) throw new Error('Combo line must have one or more key map keys separated by a comma');
        const trimedKeyMap = trim(comboKeyMap);
        keyMaps.push(trimedKeyMap);
    }

    return {
        name: comboKey,
        keyMapKeys: Immutable.List<string>(keyMaps)
    } as Readonly<Combo>;
}

export const parseComboPart = (comboPart: string): Immutable.List<Combo> => {
    const combos = Array<Combo>();

    const comboLines = split(comboPart)(Config.splitter.genericLine);

    for (const comboLine of comboLines) {
        const parsedComboLine = parseComboLine(comboLine);
        if (parsedComboLine !== null) {
            combos.push(parsedComboLine);
        }
    }

    if (checkEmpty(combos)) throw new Error('No combos found');

    return Immutable.List(combos);
}

export default parseComboPart;