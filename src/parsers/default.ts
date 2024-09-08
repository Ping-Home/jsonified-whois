import { Parser } from "../types/parsers.js";

export const defaultParser:Parser = (data, splitter) => {
    const arr = data.split('>>>')
    const responses = arr[0].split(splitter);
    const result = {};

    responses.forEach(item => {
        if (!item) {
            return;
        }
        const [key, value] = item.split(/:(.*)/s)
        const formattedKey = key && key.replace(/[^a-zA-Z\s\/]/g, '').trim().toLowerCase().replace(/\s/g, '_');
        result[formattedKey] = value ? value.trim() : null;
    })
    return result;
}