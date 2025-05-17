import {
  gtldFiledMatchers,
  ianaFieldMatchers,
  parserInitialData,
} from "../constants.ts";
import type { ParserResult } from "../types/index.d.ts";
import { normalizer } from "../utils/normalizer.ts";

export const parser = (data: string, isIana: boolean) => {
  const splitter = data.endsWith("\r\n") ? "\r\n" : "\n";

  const matchers = isIana ? ianaFieldMatchers : gtldFiledMatchers;
  const arr = data.split(">>>");
  const responses = arr[0].split(splitter);
  const result: ParserResult = { ...parserInitialData };

  responses.forEach((item) => {
    const [key, value] = item.split(/:(.*)/s);
    if (!key || !value) return;

    const normalizedKey = normalizer(key);
    const trimmedValue = value.trim();

    for (const matcher of matchers) {
      if (matcher.keywords.some((kw) => normalizedKey.includes(kw))) {
        if (matcher.targetKey === "nameServers") {
          const values = trimmedValue
            .split("\r\n")
            .map((v) => v.trim())
            .filter(Boolean);
          result.nameServers = [...(result.nameServers || []), ...values];
        } else {
          result[matcher.targetKey] = trimmedValue;
        }
        break;
      }
    }
  });

  return result;
};
