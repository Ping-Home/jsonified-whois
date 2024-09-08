import { Parser } from "../types/parsers.js";

export const dkParser:Parser = (data, splitter) => {
    const responses = data.split(splitter);
    const result = {};

    const domainData = responses.reduce((first, second) => {
        if (second.startsWith('#')) {
            return first
        }
        if (second.match(/:(?!\/\/)/s)) {
            return [...first, second]
        }
        const lastIndex = first.length - 1
        first[lastIndex] = first[lastIndex] + second
        return first
    }, [])

    domainData.forEach(item => {
        if (!item) {
            return;
        }

        const [key, value] = item.split(/:(?!\/\/)/s)
        const formattedKey = key && key.replace(/[^a-zA-Z\s\/]/g, '').trim().toLowerCase().replace(/\s/g, '_');
        const trimmedValue = value ? value.trim() : null
        if (result[formattedKey]) {
            const prevValue = Array.isArray(result[formattedKey]) ? result[formattedKey] : [result[formattedKey]]
            result[formattedKey] = [...prevValue, trimmedValue]
            return
        }

        result[formattedKey] = trimmedValue;
    })

    return result;
}