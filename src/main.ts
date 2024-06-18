import { OrderedSet, Set } from 'immutable';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import readline from 'readline';

import parseGrammarFile from "./training/parsing";

const KEY_TIMEOUT = 20;

const error = (msg: string, yg?: any) => {
	console.error('[ERROR]', msg);
	if (yg) console.log(yg.help());
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

const getArgs = () =>
    yargs(hideBin(process.argv))
		.command('$0 <grammar>', 'Runs a fighting game automaton')
		.scriptName('ft_ality')
		.positional('grammar', {
			describe: 'input grammar file',
			type: 'string',
			demandOption: 'true',
		})
		.fail((msg, _, yargs) => {
			error(msg, yargs);
		})
		.strict()
		.parse();


// side effects
const enableRawTTY = () => {
    readline.emitKeypressEvents(process.stdin)

    if (process.stdin.setRawMode != null) {
        process.stdin.setRawMode(true);
    }
}


const handleTTYInputs = (callback: (keys: Set<string>) => void) => {
    var pressedKeys : Set<string> = Set()
	var lastPress = new Date();
	let releaseTimeout: NodeJS.Timeout | null = null;

	process.stdin.on('keypress', (str, key) => {
		const currentPress = new Date();
		// re-implement exit
		if (key && key.ctrl && key.name === 'c') {
			process.exit(0);
		}

		// update pressed keys
		if (currentPress.getTime() - lastPress.getTime() > KEY_TIMEOUT) {
			pressedKeys = pressedKeys.clear();
		}
		pressedKeys = pressedKeys.add(str);

		// remember press time
		lastPress = new Date();

		// Hack to detect when the key is released on the TTY since there is no keyup event
		if (releaseTimeout) {
			clearTimeout(releaseTimeout);
		}
		releaseTimeout = setTimeout(() => {
			callback(pressedKeys)

			pressedKeys = pressedKeys.clear();
		}, KEY_TIMEOUT); 
	});
}


const main = () => {
	// check TTY
	if (process.stdout.isTTY == false) {
		error('Not a TTY');
	}

    const args = getArgs();

    // read file
    const fileContent = readFile(args['grammar'] as string);
	if (typeof fileContent !== 'string') {
		error(fileContent.message);
	}
	if (fileContent === '') {
		error('File is empty');
	}

    // get grammar
    const gameSet = parseGrammarFile(fileContent as string)

    console.log("Key mappings -----------------------------------")
    console.log(gameSet.combos.toArray());
    console.log(gameSet.keyMaps.toArray());

    // setup TTY
    enableRawTTY();

	// send inputs to state machine
	handleTTYInputs((keys) => {
		const currentKeys = gameSet.keyMaps.filter((keyMap) => keys.has(keyMap.key)).map((keyMap) => keyMap.value);
		const currentCombos = gameSet.combos.filter((combo) => combo.keyMapKeys.isSubset(currentKeys))

		if (currentCombos.size > 0) {
			const currentCombo = currentCombos.first();

			if (currentCombo !== undefined) {
				console.log(`${currentCombo.keyMapKeys.toArray()} -> ${currentCombo.name}`);
			}
		}
	});
}

main();