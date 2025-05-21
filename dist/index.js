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
import { resolve4, resolve6 } from "dns/promises";

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
    return await resolve6(domain);
  } catch (error) {
    logWarning("Unable to find IPv6 addresses for " + domain + "\n");
    return [];
  }
};
var getIpv4 = async (domain) => {
  try {
    return await resolve4(domain);
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
import tldts from "tldts";
var verifyDomain = (domain) => {
  if (!domain.length) {
    throw new Error("Domain input is required");
  }
  const domainWithoutSuffix = tldts.getDomainWithoutSuffix(domain);
  if (!domainWithoutSuffix) {
    throw new Error("Domain is not valid");
  }
};

// src/utils/queryWhoisServer.ts
import net from "net";
var queryWhoisServer = async (domain, whoisServer, port) => {
  return new Promise((resolve, reject) => {
    let data = "";
    const socket = net.createConnection(
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
import tldts2 from "tldts";

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
      this.domain = tldts2.getDomain(url) || "";
      this.hostname = tldts2.getHostname(url) || "";
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
export {
  index_default as default
};
