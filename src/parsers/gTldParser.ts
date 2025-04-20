import type { Parser, ParserResult } from "../types/parsers.ts";
import { parserInitialData } from "../utils/index.ts";

export const gTldParser: Parser = (data, splitter) => {
  const arr = data.split(">>>");
  const responses = arr[0].split(splitter);
  const result: ParserResult = { ...parserInitialData };

  responses.forEach((item) => {
    const [key, value] = item.split(/:(.*)/s);
    const trimmedKey = key?.trim();
    const trimmedValue = value?.trim();

    if (trimmedKey === "Domain Name") {
      result["domainName"] = trimmedValue;
    }

    if (trimmedKey === "Creation Date") {
      result["createdAt"] = trimmedValue;
    }

    if (trimmedKey === "Updated Date") {
      result["updateAt"] = trimmedValue;
    }

    if (
      [
        "Registry Expiry Date",
        "Registrar Registration Expiration Date",
      ].includes(trimmedKey)
    ) {
      result["expiresAt"] = trimmedValue;
    }

    if (trimmedKey === "Name Server") {
      result["nameServers"] = [...(result["nameServers"] || []), trimmedValue];
    }

    if (trimmedKey === "Ip") {
      result["ip"] = trimmedValue;
    }

    if (trimmedKey === "Registrar WHOIS Server") {
      result["registrar"] = trimmedValue;
    }
  });
  return result;
};
