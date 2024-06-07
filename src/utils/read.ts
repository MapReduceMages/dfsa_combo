import { readFileSync } from 'fs';

const readGrammarFile = (path: string): string => {
    return readFileSync(path, 'utf8');
}

export default readGrammarFile;