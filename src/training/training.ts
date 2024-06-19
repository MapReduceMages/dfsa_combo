import DFSA from '../automaton/DFSA';
import Automaton from '../models/automaton';
import GameSet from '../models/game_set';
import parse from './parsing';

export interface TrainingOutput {
    gameSet: GameSet,
    automaton: Automaton
}

const training = (grammar: string): TrainingOutput => {
    const gameSet = parse(grammar)
    const automaton = DFSA(gameSet)

    return <TrainingOutput>{
        gameSet,
        automaton
    }
}

export default training