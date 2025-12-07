import { SortState } from "@/app/__generated__/graphql";

export function getSortState(
  searchParam: keyof typeof SortState,
): SortState | undefined {
  return SortState[searchParam];
}

export type SearchParams = Record<string, string | string[] | undefined>;

export type Params = {
  [key: string]: string;
};

export type ServerProps<P = Params, S = SearchParams> = {
  params: Promise<P>;
  searchParams: Promise<S>;
};
