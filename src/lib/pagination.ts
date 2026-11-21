import type { ReadableParams } from "./filters";

export const PAGE_SIZE = 50;

/** The cursor-pagination keys we round-trip through the URL. */
export const PAGINATION_KEYS = ["first", "last", "after", "before"] as const;

export interface PaginationVariables {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
}

export interface PageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

/**
 * Reads the cursor window from the URL. Defaults to the first page forward,
 * and only ever sends one direction so the API doesn't get both.
 */
export function readPagination(
  params: ReadableParams,
  pageSize: number = PAGE_SIZE,
): PaginationVariables {
  const before = params.get("before") || undefined;
  if (before) {
    return { last: pageSize, before };
  }
  const after = params.get("after") || undefined;
  return { first: pageSize, ...(after && { after }) };
}
