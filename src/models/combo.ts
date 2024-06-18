import Immutable from 'immutable';
import type KeyMap from './key_map';

export default interface Combo {
    readonly name: string;
    readonly actions: Immutable.List<string>;
}
