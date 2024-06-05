// function that read ../../exemple_1.gmr and return the content as a string

import { readFileSync } from 'fs';

const readGrammarFile = (path: string): string => {
    return readFileSync(path   , 'utf8');
}

export default readGrammarFile;