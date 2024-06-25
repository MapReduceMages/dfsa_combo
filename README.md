# dfsa_combo

A [Deterministic Finite State Automaton](https://en.wikipedia.org/wiki/Deterministic_finite_automaton) (DFSA) that detects combos in a fighting game.

![Recordit GIF](https://raw.githubusercontent.com/MapReduceMages/dfsa_combo/main/.demo/terminal.gif)

## Usage

```bash
npm install
npm run exec ./grammars/example_2.gmr
```

## Grammar

The grammar is defined in a `.gmr` file.

The grammar is defined by twi main sections: actions and combos. The actions are defined by a key/input and a value (the name) separated by an equal sign. The combos are defined by a name and a sequence of actions separated by a plus sign. The actions and combos are separated by an ampersand.

```gmr
a=action_a
b=action_b
c=action_c
&
COMBO_A=action_a
COMBO_A_2=action_a
COMBO_A_3=action_a
COMBO_BB=action_b+action_b
COMBO_BBB=action_b+action_b+action_b
COMBO_BBC=action_b+action_b+action_c
```

> It is possible to have multiple combos with the same sequence of actions. In this case, the DFSA will detect the longest combo first.

## About

A [Deterministic Finite State Automaton](https://en.wikipedia.org/wiki/Deterministic_finite_automaton) (DFSA) is a subset of a [Finite State Machine](https://en.wikipedia.org/wiki/Finite-state_machine) (FSM) that has a finite number of states and transitions between those states. The DFSA is deterministic in that it has exactly one transition for each possible input from a given state. This means that the DFSA will always be in exactly one state at any given time.