import type { State } from './state'

type Automaton = (state: State) => (key: string) => State

export default Automaton;