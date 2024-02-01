import { SortState } from "@/app/__generated__/graphql";

export function getSortState(searchParam: any): SortState | undefined {
  return SortState[searchParam as keyof typeof SortState];
}

export type SearchParams = {
  [key: string]: string | string[] | undefined
};

export type Params = {
  [key: string]: string,
}

export type ServerProps<P = Params, S = SearchParams> = {
  params: P,
  searchParams: S,
}
