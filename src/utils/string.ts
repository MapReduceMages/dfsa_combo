
const trim = (str: string): string => {
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

export const checkEmpty = (content: string | Array<any>): boolean => {
    return content === '' || (Array.isArray(content) && content.length === 0);
}

export const sanitize = (content: string): string => {
    return trim(content);
}

