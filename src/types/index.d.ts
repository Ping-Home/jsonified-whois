export type IpAddresses = {
  ipv4: Array<string>;
  ipv6: Array<string>;
};

export type ParserResult = {
  domainName: string;
  createdAt: string;
  updateAt: string;
  expiresAt: string;
  nameServers: Array<string>;
  ipAddresses: IpAddresses;
  registrar: string;
  queriedWhoisServer: string;
  raw: string;
};

export type QueryResult = ParserResult;

export type Parser = (data: string, splitter: string) => ParserResult;

export type Parsers = (data: string) => ParserResult;

export type Normalizer = (str: string) => string;

export type FieldMatcher = {
  keywords: Array<string>;
  targetKey: keyof Omit<ParserResult,'ipAddresses'>;
  isArray?: boolean;
};

export type FieldMatchers = Array<FieldMatcher>;

export interface WhoisClientConstructor {
  fallback?: boolean;
  url: string;
  port?: number;
  whoisServer?: string;
}

export type WhoisClientConfig = WhoisClientConstructor;

export type WhoisResults = Array<QueryResult>;

export type CollectWhoisChain = Promise<WhoisResults | Promise<WhoisResults>>;

export type ExistingRegistryData = QueryResult | undefined;

export type GetFallbackData = (results: WhoisResults) => QueryResult;

export type VerifyDomain = (domain: string) => void;

export type Log = (message: unknown) => void;
