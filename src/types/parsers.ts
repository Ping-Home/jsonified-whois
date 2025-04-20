export type ParserResult = {
  domainName: string;
  createdAt: string;
  updateAt: string;
  expiresAt: string;
  nameServers: Array<string>;
  ip: unknown;
  registrar: string;
};

export type Parser = (data: string, splitter: string) => ParserResult;
export type Parsers = (data: string, suffix: string) => ParserResult;
