import Immutable from "immutable";
import Config from '../../config.json';

export const trim = (str: string): string => {
    const length = str.length;
    let start = 0;
    let end = length - 1;

    while (start < length && str[start] === ' ') {
        start++;
    }

    while (end >= 0 && str[end] === ' ') {
        end--;
    }

    if (start > end) {
        return '';
    }

    let result = '';
    for (let i = start; i <= end; i++) {
        result += str[i];
    }

    return result;
};

export const  checkEmpty = (content: string | undefined | Array<any> | Immutable.List<string>): boolean => {
    return content === undefined || content === '' || (Array.isArray(content) && content.length === 0) || Immutable.List.isList(content) && content.count() === 0;
}

export const split = (separator: string) => (content: string): Immutable.List<string> => {
    const parts = Array<string>();

    let part = '';
    let lastIsSeparator = false;
    for (let i = 0; i < content.length; i++) {
        const currentCharacter = content[i];
        if (currentCharacter === separator) {
            parts.push(part);
            part = '';
            lastIsSeparator = true;
        } else {
            part += currentCharacter;
            lastIsSeparator = false;
        }
    }

    if (part !== '' || lastIsSeparator) {
        parts.push(part);
    }

    return Immutable.List<string>(parts);
}

export const splitLines = split(Config.splitter.genericLine);