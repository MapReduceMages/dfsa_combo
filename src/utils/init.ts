import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import readline from 'readline';

import {  State } from '../models/state';
import { stateToCombos } from '../automaton/state';
import GameSet from '../models/game_set';

const KEY_TIMEOUT = 200;

export const handleError = (msg: string) => {
	console.error('[ERROR]', msg);
	process.exit(1);
};

// I/O, not pure by design, tryWrapper remedies this somewhat
export const tryWrapper =
	(fn: Function) =>
		(...params: any): any | Error => {
			try {
				return fn(...params);
			} catch (error) {
				return error;
			}
		};
export const readFile = (path: string): string | Error => tryWrapper(fs.readFileSync)(path, 'utf-8');
export const getArgs = (args: string[]): string[] => hideBin(args)

// side effects
export const enableRawTTY = () => {
	readline.emitKeypressEvents(process.stdin)

	if (process.stdin.setRawMode != null) {
		process.stdin.setRawMode(true);
	}
}

export const handleTTYInputs =
	(update: (key: string) => any) =>
		(timeout: () => void) => {

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

export const processStateForDisplay = (gameset: GameSet) => (state: State): string => {
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