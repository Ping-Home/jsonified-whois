import { parser } from "./parser/index.ts";
import { ianaWhoIsServer, parserInitialData } from "./constants.ts";
import { getIpAddresses } from "./utils/getIpAddresses.ts";
import { verifyDomain } from "./utils/verifyDomains.ts";
import { queryWhoisServer } from "./utils/queryWhoisServer.ts";
import tldts from "tldts";
import { getFallbackData } from "./utils/getFallbackData.ts";
import type {
  CollectWhoisChain,
  ExistingRegistryData,
  IpAddresses,
  QueryResult,
  WhoisClientConstructor,
  WhoisResults,
} from "./types/index.d.ts";
import { logError } from "./utils/log.ts";

/**
 * A client to get basic whois information
 */
class WhoisClient {
  constructor({ url, fallback, port, whoisServer }: WhoisClientConstructor) {
    try {
      url && verifyDomain(url);
      this.port = port || 43;
      this.whoisServer = whoisServer || ianaWhoIsServer;
      this.fallbackEnabled = fallback;
      this.domain = tldts.getDomain(url);
      this.hostname = tldts.getHostname(url);
    } catch (error) {
      logError("Something went wrong when initializing the client \n");
      throw error;
    }
  }

  private port: number = 43;
  private whoisServer: string = ianaWhoIsServer;
  private ipAddresses: IpAddresses = {
    ipv4: [],
    ipv6: [],
  };
  private hostname: string = "";
  private domain: string = "";
  private fallbackEnabled: boolean = false;
  private whoisResults: WhoisResults = [];

  /**
   * Fetch data for the instantiated domain
   */
  public async fetchData() {
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
      ...lastQuery,
    };
    return JSON.stringify(data);
  }

  /**
   * Queries whois servers and collects whois info recursively
   */
  private async collectWhoisChain(
    domain: string,
    whoisServer: string
  ): CollectWhoisChain {
    const existingRegistryData: ExistingRegistryData = this.whoisResults.find(
      (item) => item.queriedWhoisServer === whoisServer
    );

    if (
      existingRegistryData &&
      (existingRegistryData.registrar.length === 0 ||
        existingRegistryData.registrar === whoisServer)
    ) {
      return this.whoisResults;
    }

    const response = await this.queryWhoisServer(domain, whoisServer);

    this.whoisResults.push({
      ...response,
      ipAddresses: this.ipAddresses,
    });

    if (!response.registrar) {
      return this.whoisResults;
    }

    return await this.collectWhoisChain(domain, response.registrar);
  }

  /**
   * Query given whois server and return parsed data with matched keys.
   */
  private async queryWhoisServer(
    domain: string,
    whoisServer: string
  ): Promise<QueryResult> {
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
}

export default WhoisClient;
