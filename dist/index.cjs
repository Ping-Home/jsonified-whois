"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

// src/constants.ts
var timeoutSeconds = 60;
var ianaWhoIsServer = "whois.iana.org";
var parserInitialData = {
  createdAt: "",
  domainName: "",
  expiresAt: "",
  ipAddresses: {
    ipv4: [],
    ipv6: []
  },
  nameServers: [],
  registrar: "",
  updateAt: "",
  queriedWhoisServer: "",
  raw: ""
};
var ianaFieldMatchers = [
  {
    keywords: ["creation", "created", "registered"],
    targetKey: "createdAt"
  },
  {
    keywords: ["updated", "changed", "last updated"],
    targetKey: "updateAt"
  },
  {
    keywords: ["expiry", "expiration", "expires"],
    targetKey: "expiresAt"
  },
  {
    keywords: ["name server", "nameserver", "nserver"],
    targetKey: "nameServers",
    isArray: true
  },
  {
    keywords: ["whois"],
    targetKey: "registrar"
  }
];
var gtldFiledMatchers = [
  {
    keywords: ["creation", "created", "registered"],
    targetKey: "createdAt"
  },
  {
    keywords: ["updated", "changed", "last updated"],
    targetKey: "updateAt"
  },
  {
    keywords: ["expiry", "expiration", "expires"],
    targetKey: "expiresAt"
  },
  {
    keywords: [
      "name server",
      "nameserver",
      "nserver",
      "nameservers",
      "hostname"
    ],
    targetKey: "nameServers",
    isArray: true
  },
  {
    keywords: ["registrar whois server"],
    targetKey: "registrar"
  }
];
var warnColor = "\x1B[33m";
var errorColor = "\x1B[31m";

// src/utils/normalizer.ts
var normalizer = (str) => {
  return str.toLowerCase().replace(/[^a-z\s]/g, "").trim();
};

// src/parser/index.ts
var nameServers = "nameServers";
var parser = (data, isIana) => {
  const splitter = data.endsWith("\r\n") ? "\r\n" : "\n";
  const matchers = isIana ? ianaFieldMatchers : gtldFiledMatchers;
  const arr = data.split(">>>");
  const responses = arr[0].split(splitter);
  const result = { ...parserInitialData };
  responses.forEach((item) => {
    const [key, value] = item.split(/:(.*)/s);
    if (!key || !value) return;
    const normalizedKey = normalizer(key);
    const trimmedValue = value.trim();
    for (const matcher of matchers) {
      const includesKeyword = matcher.keywords.some(
        (kw) => normalizedKey.includes(kw)
      );
      if (!includesKeyword) {
        continue;
      }
      if (matcher.targetKey === nameServers) {
        const values = trimmedValue.split("\r\n").map((v) => v.trim()).filter(Boolean);
        result.nameServers = [...result.nameServers || [], ...values];
        break;
      }
      result[matcher.targetKey] = trimmedValue;
      break;
    }
  });
  return result;
};

// src/utils/getIpAddresses.ts
var import_promises = require("dns/promises");

// src/utils/log.ts
var logWarning = (message) => {
  console.warn(warnColor, message);
};
var logError = (message) => {
  console.error(errorColor, message);
};

// src/utils/getIpAddresses.ts
var getIpv6 = async (domain) => {
  try {
    return await (0, import_promises.resolve6)(domain);
  } catch (error) {
    logWarning("Unable to find IPv6 addresses for " + domain + "\n");
    return [];
  }
};
var getIpv4 = async (domain) => {
  try {
    return await (0, import_promises.resolve4)(domain);
  } catch (error) {
    logWarning("Unable to find IPv4 addresses for " + domain + "\n");
    return [];
  }
};
var getIpAddresses = async (domain) => {
  const ipv4 = await getIpv4(domain);
  const ipv6 = await getIpv6(domain);
  return {
    ipv4,
    ipv6
  };
};

// src/utils/verifyDomains.ts
var import_tldts = __toESM(require("tldts"), 1);
var verifyDomain = (domain) => {
  if (!domain.length) {
    throw new Error("Domain input is required");
  }
  const domainWithoutSuffix = import_tldts.default.getDomainWithoutSuffix(domain);
  if (!domainWithoutSuffix) {
    throw new Error("Domain is not valid");
  }
};

// src/utils/queryWhoisServer.ts
var import_net = __toESM(require("net"), 1);
var queryWhoisServer = async (domain, whoisServer, port) => {
  return new Promise((resolve, reject) => {
    let data = "";
    const socket = import_net.default.createConnection(
      { host: whoisServer, port },
      () => socket.write(domain + "\r\n")
    );
    socket.setTimeout(timeoutSeconds * 1e3);
    socket.on("data", (chunk) => data += chunk);
    socket.on("close", () => resolve(data));
    socket.on("timeout", () => socket.destroy(new Error("Timeout")));
    socket.on("error", reject);
  });
};

// src/index.ts
var import_tldts2 = __toESM(require("tldts"), 1);

// src/utils/getFallbackData.ts
var getFallbackData = (results) => {
  const reversedArr = [...results].reverse();
  let counter = [];
  for (let index in reversedArr) {
    counter[index] = 0;
    for (let key in reversedArr[index]) {
      if (reversedArr[index][key]) {
        continue;
      }
      counter[index]++;
    }
  }
  const minLossIndex = counter.indexOf(Math.min(...counter));
  return { ...reversedArr[minLossIndex] };
};

// src/index.ts
var WhoisClient = class {
  constructor({ url, fallback, port, whoisServer }) {
    try {
      url && verifyDomain(url);
      this.port = port || 43;
      this.whoisServer = whoisServer || ianaWhoIsServer;
      this.fallbackEnabled = fallback || false;
      this.domain = import_tldts2.default.getDomain(url) || "";
      this.hostname = import_tldts2.default.getHostname(url) || "";
    } catch (error) {
      logError("Something went wrong when initializing the client \n");
      throw error;
    }
  }
  port = 43;
  whoisServer = ianaWhoIsServer;
  ipAddresses = {
    ipv4: [],
    ipv6: []
  };
  hostname = "";
  domain = "";
  fallbackEnabled = false;
  whoisResults = [];
  /**
   * Fetch data for the instantiated domain
   */
  async fetchData() {
    this.ipAddresses = await getIpAddresses(this.hostname);
    const response = await this.collectWhoisChain(
      this.domain,
      this.whoisServer
    );
    let lastQuery = { ...response.at(-1) };
    if (this.fallbackEnabled) {
      lastQuery = getFallbackData(response);
    }
    delete lastQuery.raw;
    const data = {
      queryData: response,
      ...lastQuery
    };
    return JSON.stringify(data);
  }
  /**
   * Queries whois servers and collects whois info recursively
   */
  async collectWhoisChain(domain, whoisServer) {
    const existingRegistryData = this.whoisResults.find(
      (item) => item.queriedWhoisServer === whoisServer
    );
    if (existingRegistryData && (existingRegistryData.registrar.length === 0 || existingRegistryData.registrar === whoisServer)) {
      return this.whoisResults;
    }
    const response = await this.queryWhoisServer(domain, whoisServer);
    this.whoisResults.push({
      ...response,
      ipAddresses: this.ipAddresses
    });
    if (!response.registrar) {
      return this.whoisResults;
    }
    return await this.collectWhoisChain(domain, response.registrar);
  }
  /**
   * Query given whois server and return parsed data with matched keys.
   */
  async queryWhoisServer(domain, whoisServer) {
    try {
      const response = await queryWhoisServer(domain, whoisServer, this.port);
      const isIana = whoisServer === ianaWhoIsServer;
      const conversionResult = parser(response, isIana);
      conversionResult.domainName = this.domain;
      conversionResult.queriedWhoisServer = whoisServer;
      conversionResult.raw = response;
      conversionResult.ipAddresses = this.ipAddresses;
      return conversionResult;
    } catch (error) {
      logError(error);
      return parserInitialData;
    }
  }
};
var index_default = WhoisClient;
