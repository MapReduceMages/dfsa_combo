
import Immutable from 'immutable';
import { checkEmpty, trim, split, splitLines } from '../utils/string';
import Config from '../../config.json';
import type Combo from '../models/combo';

export const parseComboLine = (comboLine: string): Readonly<Combo> | null => {
    if (checkEmpty(comboLine)) return null;
    const comboParts = split(Config.splitter.combo)(comboLine);
    if (comboParts.count() !== 2) throw new Error('Combo line must have a combo key and one or more key map keys');
    // ------------ key
    const comboKey = comboParts.get(0);
    const trimedComboKey = trim(comboKey!);
    if (checkEmpty(trimedComboKey)) throw new Error('Combo line must have a combo key');
    // ------------ key map keys
    const comboKeyMaps = split(Config.splitter.comboKeyMap)(comboParts.get(1)!);
    const trimedComboKeyMaps = comboKeyMaps.map(trim);
    if (checkEmpty(trimedComboKeyMaps)) throw new Error('Combo line must have one or more key map keys');
    trimedComboKeyMaps.forEach((comboKeyMap: string) => {
        if (comboKeyMap === '') throw new Error('Combo line cannot have empty key map keys');
    });

    return {
        name: trimedComboKey,
        keyMapKeys: trimedComboKeyMaps,
    } as Readonly<Combo>;
}

export const parseComboPartLines = (comboLines: Immutable.List<string>) => (combos: Immutable.List<Combo>): Immutable.List<Combo> => {
    const currentLine = comboLines.first();
    if (currentLine !== undefined) {
        const parsedComboLine = parseComboLine(currentLine);
        return parseComboPartLines(comboLines.shift())(parsedComboLine ? combos.push(parsedComboLine) : combos);
    }

    return combos;
}

export const parseComboPart = (comboPart: string): Immutable.List<Combo> => {
    const comboLines = splitLines(comboPart);
    const comboLinesParser = parseComboPartLines(comboLines);
    const parsedCombos = comboLinesParser(Immutable.List<Combo>());

    if (checkEmpty(parsedCombos)) throw new Error('No combos found');

    return parsedCombos;
}

export default parseComboPart;
