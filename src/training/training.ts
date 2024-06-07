
import readGrammarFile from '../utils/read';
import type GameSet from '../models/game_set';
import Config from '../../config.json';
import parseKeyMapPart from './key_map';
import parseComboPart from './combo';
import { split } from '../utils/string';

const parseGrammarFile = (path: string): Readonly<GameSet> => {
    // ------------------ Load grammar file
    const grammarContent = readGrammarFile(path);

    // ------------------ Split main parts
    const mainParts = split(grammarContent)(Config.splitter.main);
    if (mainParts.count() !== 2) {
        throw new Error('Invalid grammar file');
    }

    // ------------------ Parse key map part
    const keyMapPart = mainParts.get(0)!;
    const keyMaps = parseKeyMapPart(keyMapPart);

    // ------------------ Parse combo part
    const comboPart = mainParts.get(1)!;
    const combos = parseComboPart(comboPart);

    return <GameSet>{
        keyMaps,
        combos
    };
}

export default parseGrammarFile