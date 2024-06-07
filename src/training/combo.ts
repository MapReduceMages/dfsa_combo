
import Immutable from 'immutable';
import { checkEmpty, sanitize } from '../utils/string';
import Config from '../../config.json';
import type Combo from '../models/combo';

export const parseComboLine = (comboLine: string): Readonly<Combo> | null => {
    if (checkEmpty(comboLine)) return null;
    const sanitizedLine = sanitize(comboLine);
    const combo = sanitizedLine.split(Config.splitter.combo);
    if (combo.length !== 2) throw new Error('Invalid grammar file');
    const comboKey = combo[0];
    if (checkEmpty(comboKey)) throw new Error('Invalid grammar file');
    const comboKeyMaps = combo[1].split(Config.splitter.comboKeyMap);
    if (checkEmpty(comboKeyMaps)) throw new Error('Invalid grammar file');
    const keyMaps: string[] = Array<string>();
    for (const comboKeyMap of comboKeyMaps) {
        if (checkEmpty(comboKeyMap)) throw new Error('Invalid grammar file');
        const sanitizedKeyMap = sanitize(comboKeyMap);
        keyMaps.push(sanitizedKeyMap);
    }

    return {
        name: comboKey,
        keyMapKeys: Immutable.List<string>(keyMaps)
    };
}

export const parseComboPart = (comboPart: string): Immutable.List<Combo> => {
    const combos = Array<Combo>();

    const comboLines = comboPart.split(Config.splitter.genericLine);

    for (const comboLine of comboLines) {
        const parsedComboLine = parseComboLine(comboLine);
        if (parsedComboLine !== null) {
            combos.push(parsedComboLine);
        }
    }

    if (checkEmpty(combos)) throw new Error('Invalid grammar file');

    return Immutable.List(combos);
}

export default parseComboPart;