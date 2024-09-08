import { Parser } from "../types/parsers.js";

export const nlParser:Parser = (data, splitter) => {
    const responses = data.split(splitter);
    const result = {};

    const arr = responses.reduce((first, second) => {
        if (second.match(/:(?!\/\/)/s)) {
            return [...first, second]
        }
        const lastIndex = first.length - 1
        first[lastIndex] = first[lastIndex] + second
        return first
    }, [])

    arr.forEach(item => {
        if (!item) {
            return;
        }
        const [key, value] = item.split(/:(?!\/\/)/s)
        const formattedKey = key && key.replace(/[^a-zA-Z\s\/]/g, '').trim().toLowerCase().replace(/\s/g, '_');
        result[formattedKey] = value ? value.trim() : null;
    })
    return result
}