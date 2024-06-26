
import Immutable from 'immutable';
import type KeyMap from '../models/key_map';
import { checkEmpty, trim, split, splitLines } from '../utils/string';
import Config from './../config.json';

export const parseKeyMapLine = (keyMapLine: string): Readonly<KeyMap> | null | Error => {
    if (checkEmpty(keyMapLine)) return null;
    const trimedLine = trim(keyMapLine);
    const keyMap = split(Config.splitter.keyMap)(trimedLine);
    if (keyMap.count() !== 2) return new Error('Key map line must have exactly one key and one value separated by a colon');
    // ------------ key
    const key = keyMap.get(0);
    const trimedKey = trim(key!);
    if (checkEmpty(trimedKey)) return new Error('Key map line must have a key');
    // ------------ value
    const value = keyMap.get(1);
    const trimedValue = trim(value!);
    if (checkEmpty(value)) return new Error('Key map line must have a value');

    return {
        key: trimedKey,
        action: trimedValue,
    } as Readonly<KeyMap>;
}

export const parseKeyMapPartLine = (keyMapLines: Immutable.List<string>) => (keyMaps: Immutable.List<KeyMap>): Immutable.List<KeyMap> | Error => {
    const currentLine = keyMapLines.first();
    if (currentLine !== undefined) {
        const parsedKeyMapLine = parseKeyMapLine(currentLine);
        if (parsedKeyMapLine instanceof Error) return parsedKeyMapLine;
        return parseKeyMapPartLine(keyMapLines.shift())(parsedKeyMapLine ? keyMaps.push(parsedKeyMapLine) : keyMaps);
    }

    return keyMaps;
}

export const parseKeyMapPart = (keyMapPart: string): Immutable.List<KeyMap> | Error => {
    const keyMapLines = splitLines(keyMapPart);
    const keyMapLinesParser = parseKeyMapPartLine(keyMapLines);
    const parsedKeyMaps = keyMapLinesParser(Immutable.List<KeyMap>());
    if (parsedKeyMaps instanceof Error) return parsedKeyMaps;

    if (checkEmpty(parsedKeyMaps)) return new Error('No key maps found');

    return parsedKeyMaps
}

export default parseKeyMapPart;