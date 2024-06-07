
import Immutable from 'immutable';
import { checkEmpty, trim, split, splitLines } from '../utils/string';
import Config from '../../config.json';
import type Combo from '../models/combo';

export const parseComboLine = (comboLine: string): Readonly<Combo> | null => {
    if (checkEmpty(comboLine)) return null;
    const trimedLine = trim(comboLine);
    const combo = split(Config.splitter.combo)(trimedLine);
    if (combo.count() !== 2) throw new Error('Combo line must have a combo key and one or more key map keys');
    const comboKey = combo.get(0);
    if (checkEmpty(comboKey)) throw new Error('Combo line must have a combo key');
    const comboKeyMaps = split(Config.splitter.comboKeyMap)(combo.get(1)!);
    if (checkEmpty(comboKeyMaps)) throw new Error('Combo line must have one or more key map keys');
    const keyMaps: string[] = Array<string>();
    for (const comboKeyMap of comboKeyMaps) {
        if (checkEmpty(comboKeyMap)) throw new Error('Combo line must have one or more key map keys');
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

    const comboLines = splitLines(comboPart);

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