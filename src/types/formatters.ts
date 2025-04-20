import type { ParserResult } from "./parsers.ts";

type Result = Record<string, string | Array<string> | null>;
type FormatterResult = Record<string, string | Array<string> | Result | null>;

export type Formatter = (data: ParserResult) => FormatterResult;
