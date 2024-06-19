import type KeyMap from '../models/key_map';

const keyDisplay = (keyMap: Immutable.List<KeyMap>) : string =>
    keyMap.reduce((acc, key) => {
        return acc += `${key.key} -> ${key.action}\n`;
    }, "");

export default keyDisplay;