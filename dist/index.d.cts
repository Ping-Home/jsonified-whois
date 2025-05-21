interface WhoisClientConstructor {
  fallback?: boolean;
  url: string;
  port?: number;
  whoisServer?: string;
}

/**
 * A client to get basic whois information
 */
declare class WhoisClient {
    constructor({ url, fallback, port, whoisServer }: WhoisClientConstructor);
    private port;
    private whoisServer;
    private ipAddresses;
    private hostname;
    private domain;
    private fallbackEnabled;
    private whoisResults;
    /**
     * Fetch data for the instantiated domain
     */
    fetchData(): Promise<string>;
    /**
     * Queries whois servers and collects whois info recursively
     */
    private collectWhoisChain;
    /**
     * Query given whois server and return parsed data with matched keys.
     */
    private queryWhoisServer;
}

export { WhoisClient as default };
