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
    const parsed = parseInt(n);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

export function parsePaginationInput(raw: RawPaginationInput): PaginationInput {
  return {
    after: raw.after,
    before: raw.before,
    first: parseNumber(raw.first),
    last: parseNumber(raw.last),
  };
}
