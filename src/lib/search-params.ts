import { SortState } from "@/app/__generated__/graphql";

export function getSortState(searchParam: any): SortState | undefined {
  return SortState[searchParam as keyof typeof SortState];
}

export type SearchParams = {
  [key: string]: string | string[] | undefined
};