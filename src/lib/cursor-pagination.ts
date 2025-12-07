import { parseString } from "./records-filter";
import { SearchParams } from "./server-props";

export interface CursorInput {
  after?: string;
  before?: string;
}

export interface RawPaginationInput extends CursorInput {
  first?: string;
  last?: string;
}

export interface PaginationInput extends CursorInput {
  first?: number;
  last?: number;
}

function parseNumber(n: string | undefined): number | undefined {
  if (n) {
    const parsed = parseInt(n, 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function parseRawPaginationInput(input: SearchParams): RawPaginationInput {
  return {
    after: parseString(input.after),
    before: parseString(input.before),
    first: parseString(input.first),
    last: parseString(input.last),
  } satisfies RawPaginationInput;
}

export function parsePaginationInput(input: SearchParams): PaginationInput {
  const raw = parseRawPaginationInput(input);
  return {
    after: raw.after,
    before: raw.before,
    first: parseNumber(raw.first),
    last: parseNumber(raw.last),
  };
}
