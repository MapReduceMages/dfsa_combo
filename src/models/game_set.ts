import Immutable from 'immutable';
import type KeyMap from './key_map';
import type Combo from './combo';

export default interface GameSet {
    readonly keyMaps: Immutable.List<KeyMap>;
    readonly combos: Immutable.List<Combo>;
}