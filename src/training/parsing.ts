
import type GameSet from '../models/game_set';
import Config from '../../config.json';
import parseKeyMapPart from './key_map';
import parseComboPart from './combo';
import { split, splitLines } from '../utils/string';
import { groupEnd } from 'console';
import DFSA from '../automaton/DFSA';

const parse = (grammar: string): Readonly<GameSet> => {
    const mainParts = split(Config.splitter.main)(grammar);
    if (mainParts.count() !== 2) {
        throw new Error('Invalid grammar file (need exactly 2 parts)');
    }

    return {
       keyMaps: parseKeyMapPart(mainParts.get(0)!),
       combos: parseComboPart(mainParts.get(1)!),
    } as Readonly<GameSet>;
}

export default parse