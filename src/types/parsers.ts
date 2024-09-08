export type ParserResult = Record<string, string | Array<string>>

export type Parser = (data: string, splitter: string) => ParserResult
export type Parsers = (data: string, suffix: string) => ParserResult