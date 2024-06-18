import Immutable from 'immutable';

export default interface Combo {
    readonly name: string;
    readonly actions: Immutable.List<string>;
}
