import type { Parser, ParserResult } from "../types/parsers.ts";
import { parserInitialData } from "../utils/index.ts";

export const defaultParser: Parser = (data, splitter) => {
  const arr = data.split(">>>");
  const responses = arr[0].split(splitter);
  const result: ParserResult = { ...parserInitialData };

  responses.forEach((item) => {
    const [key, value] = item.split(/:(.*)/s);
    const trimmedKey = key?.trim();
    const trimmedValue = value?.trim();

    if (trimmedKey === "nserver") {
      result["nameServers"] = [...(result["nameServers"] || []), trimmedValue];
    }

    if (["whois", "refer"].includes(trimmedKey)) {
      result["registrar"] = trimmedValue;
    }
  });
  return result;
};
