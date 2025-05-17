import type { FieldMatchers, ParserResult } from "./types/index.js";

export const ianaWhoIsServer = "whois.iana.org";

export const parserInitialData: ParserResult = {
  createdAt: "",
  domainName: "",
  expiresAt: "",
  ipAddresses: {
    ipv4: [],
    ipv6: [],
  },
  nameServers: [],
  registrar: "",
  updateAt: "",
  queriedWhoisServer: "",
  raw: "",
};

export const ianaFieldMatchers: FieldMatchers = [
  {
    keywords: ["creation", "created", "registered"],
    targetKey: "createdAt",
  },
  {
    keywords: ["updated", "changed", "last updated"],
    targetKey: "updateAt",
  },
  {
    keywords: ["expiry", "expiration", "expires"],
    targetKey: "expiresAt",
  },
  {
    keywords: ["name server", "nameserver", "nserver"],
    targetKey: "nameServers",
    isArray: true,
  },
  {
    keywords: ["whois"],
    targetKey: "registrar",
  },
];

export const gtldFiledMatchers: FieldMatchers = [
  {
    keywords: ["creation", "created", "registered"],
    targetKey: "createdAt",
  },
  {
    keywords: ["updated", "changed", "last updated"],
    targetKey: "updateAt",
  },
  {
    keywords: ["expiry", "expiration", "expires"],
    targetKey: "expiresAt",
  },
  {
    keywords: ["name server", "nameserver", "nserver"],
    targetKey: "nameServers",
    isArray: true,
  },
  {
    keywords: ["registrar whois server"],
    targetKey: "registrar",
  },
];

export const warnColor = "\x1b[33m";
export const errorColor = "\x1b[31m";
