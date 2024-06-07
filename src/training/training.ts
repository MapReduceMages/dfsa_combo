
import readGrammarFile from '../utils/read';
import type GameSet from '../models/game_set';
import Config from '../../config.json';
import parseKeyMapPart from './key_map';
import parseComboPart from './combo';
import { split, splitLines } from '../utils/string';

const parseGrammarFile = (path: string): Readonly<GameSet> => {
    const grammarContent = readGrammarFile(path);

    const mainParts = split(Config.splitter.main)(grammarContent);
    if (mainParts.count() !== 2) {
        throw new Error('Invalid grammar file');
    }

    return {
       keyMaps: parseKeyMapPart(mainParts.get(0)!),
       combos: parseComboPart(mainParts.get(1)!),
    } as Readonly<GameSet>;
}

export default parseGrammarFile