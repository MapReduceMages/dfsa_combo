import DFSA from '../automaton/DFSA';
import Automaton from '../models/automaton';
import GameSet from '../models/game_set';
import parse from './parsing';

export interface TrainingOutput {
    gameSet: GameSet,
    automaton: Automaton
}

const training = (grammar: string): TrainingOutput | Error => {
    const gameSet = parse(grammar)
    if (gameSet instanceof Error) return gameSet

    const automaton = DFSA(gameSet)

    return <TrainingOutput>{
        gameSet,
        automaton
    }
}

export default training