import { List } from 'immutable';

import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import readline from 'readline';

import comboDisplay from './utils/combo_display';
import keyDisplay from './utils/key_display';
import training, { TrainingOutput } from './training/training';
import { EMPTY_STATE, INITIAL_STATE, State } from './models/state';
import { stateToCombos } from './automaton/state';
import GameSet from './models/game_set';

const KEY_TIMEOUT = 200;

const handleError = (msg: string) => {
	console.error('[ERROR]', msg);
	process.exit(1);
};

// I/O, not pure by design, tryWrapper remedies this somewhat
const tryWrapper =
	(fn: Function) =>
	(...params: any): any | Error => {
		try {
			return fn(...params);
		} catch (error) {
			return error;
		}
	};
const readFile = (path: string): string | Error => tryWrapper(fs.readFileSync)(path, 'utf-8');
const getArgs = (args : string[]) : string[] => hideBin(args)

// side effects
const enableRawTTY = () => {
    readline.emitKeypressEvents(process.stdin)

    if (process.stdin.setRawMode != null) {
        process.stdin.setRawMode(true);
    }
}


const handleTTYInputs = 
	(update: (key : string) => any) =>
	(timeout : () => void) => {

	let releaseTimeout: NodeJS.Timeout | null = null;
	process.stdin.on('keypress', (str, key) => {
		// re-implement exit
		if (key && key.ctrl && key.name === 'c') {
			process.exit(0);
		}

		update(key.name);
		if (releaseTimeout) {
			clearTimeout(releaseTimeout);
		}
		releaseTimeout = setTimeout(() => {
			timeout();
		}, KEY_TIMEOUT); 
	});
}

const processStateForDisplay = (gameset: GameSet) => (state: State) : string => {
	if (state.length > 0) {
		const combos = stateToCombos(gameset)(state);

		// moves
		const moveString = combos.first()?.actions.reduce((acc, action) => acc += `[${action}] `, '') ?? '';
		// combos
		const comboString = combos.reduce((acc, combo) => acc += combo.name + '\n', '');

		return moveString + '\n' + comboString;
	}
	return "";
}

const main = () => {
	// check TTY
	if (process.stdout.isTTY == false) {
		handleError('Not a TTY');
	}

    // setup TTY
    enableRawTTY();

	// get grammar file arg
    const args = getArgs(process.argv);
	if (args.length < 1)
		handleError("Grammar file not provided")

    // read file
    const fileContent = readFile(args[0])
	if (typeof fileContent !== 'string') {
		handleError(fileContent.message);
	}
	if (fileContent === '') {
		handleError('File is empty');
	}

    // get grammar
	var machine : TrainingOutput;
	machine = tryWrapper(training)(fileContent)
	if (machine instanceof Error) {
		handleError(machine.message);
	}

    console.log("Combos:");
    console.log(comboDisplay(machine.gameSet.combos));
    console.log("Key Mappings:");
    console.log(keyDisplay(machine.gameSet.keyMaps));
    console.log("-----------------------------------------");


	var state : State = INITIAL_STATE;
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
			console.log(visualizeMoves(state));
			state = EMPTY_STATE;
		}
	);
}

main();