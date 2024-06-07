
import Immutable from 'immutable';
import type KeyMap from '../models/key_map';
import { checkEmpty, sanitize } from '../utils/string';
import Config from '../../config.json';

export const parseKeyMapLine = (keyMapLine: string): Readonly<KeyMap> | null => {
    if (checkEmpty(keyMapLine)) return null;
    const sanitizedLine = sanitize(keyMapLine);

    const keyMap = sanitizedLine.split(Config.splitter.keyMap);

    if (keyMap.length !== 2) {
        throw new Error('Key map line must have exactly one key and one value separated by a colon');
    }

    const key = keyMap[0];
    if (checkEmpty(key)) throw new Error('Key map line must have a key');
    const value = keyMap[1];
    if (checkEmpty(value)) throw new Error('Key map line must have a value');

    return {
        key: key,
        value: keyMap[1]
    };
}

export const parseKeyMapPart = (keyMapPart: string): Immutable.List<KeyMap> => {
    const keyMaps = Array<KeyMap>();

    const keyMapLines = keyMapPart.split(Config.splitter.genericLine);


    for (const keyMapLine of keyMapLines) {
        const parsedKeyMapLine = parseKeyMapLine(keyMapLine);
        if (parsedKeyMapLine !== null) {
            keyMaps.push(parsedKeyMapLine);
        }
    }

    if (checkEmpty(keyMaps)) throw new Error('No key maps found');


    return Immutable.List(keyMaps);
}

export default parseKeyMapPart;