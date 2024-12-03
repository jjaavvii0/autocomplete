function lowerBound(words: string[], prefix: string): number {
    let left = 0,
        right = words.length;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (words[mid] >= prefix) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}

function upperBound(words: string[], prefix: string): number {
    let left = 0,
        right = words.length;
    const nextPrefix =
        prefix.slice(0, -1) +
        String.fromCharCode(prefix.charCodeAt(prefix.length - 1) + 1);
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (words[mid] >= nextPrefix) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}

export function binarySearchRange(words: string[], prefix: string): string[] {
    const start = lowerBound(words, prefix);
    const end = upperBound(words, prefix);
    return words.slice(start, end);
}
