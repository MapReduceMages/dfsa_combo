import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import readline from 'readline';

import comboDisplay from './utils/combo_display';
import keyDisplay from './utils/key_display';
import training, { TrainingOutput } from './training/training';
import { EMPTY_STATE, INITIAL_STATE, State } from './models/state';
import { stateToCombos } from './automaton/state';
import GameSet from './models/game_set';
import { enableRawTTY, getArgs, handleError, handleTTYInputs, processStateForDisplay, readFile } from './utils/init';

const init = (): TrainingOutput => {
	// check TTY
	if (process.stdout.isTTY == false) {
		return handleError('Not a TTY');
	}

	// setup TTY
	enableRawTTY();

	// get grammar file arg
	const args = getArgs(process.argv);
	if (args.length < 1)
		return handleError("Grammar file not provided")

	// read file
	const fileContent = readFile(args[0])
	if (typeof fileContent !== 'string') {
		return handleError(fileContent.message);
	}
	if (fileContent === '') {
		return handleError('File is empty');
	}

	// get grammar
	const machine = training(fileContent)
	if (machine instanceof Error) {
		return handleError(machine.message);
	}

	return machine;
}

const visualizeGameSet = (machine: TrainingOutput) => {
	console.log("Combos:");
	console.log(comboDisplay(machine.gameSet.combos));
	console.log("Key Mappings:");
	console.log(keyDisplay(machine.gameSet.keyMaps));
	console.log("-----------------------------------------");
}

const main = () => {
	const machine = init();

	visualizeGameSet(machine);

	var state: State = INITIAL_STATE;
	const visualizeMoves = processStateForDisplay(machine.gameSet);

	// send inputs to state machine
	handleTTYInputs(
		// update
		(key) => {
			state = machine.automaton(state)(key);
		}
	)(
		// timeout
		() => {
			const moves = visualizeMoves(state)
			if (moves.trim().length !== 0) console.log(moves);
			state = EMPTY_STATE;
		}
	);
}

main();