
import readGrammarFile from '../utils/read';
import type GameSet from '../models/game_set';
import Config from '../../config.json';
import parseKeyMapPart from './key_map';
import parseComboPart from './combo';

const parseGrammarFile = (path: string): Readonly<GameSet> => {
    const grammarContent = readGrammarFile(path);

    const mainParts = grammarContent.split(Config.splitter.main);
    if (mainParts.length !== 2) {
        throw new Error('Invalid grammar file');
    }

    const keyMapPart = mainParts[0];
    const keyMaps = parseKeyMapPart(keyMapPart);

    const comboPart = mainParts[1];
    const combos = parseComboPart(comboPart);

    return <GameSet>{
        keyMaps,
        combos
    };
}

export default parseGrammarFile