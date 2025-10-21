import { MapRecordSortableField } from "@/app/__generated__/graphql";

export function parseMapSortField(
  input: string,
): MapRecordSortableField | undefined {
  switch (input.toLowerCase().trim()) {
    case "date":
      return MapRecordSortableField.Date;
    case "rank":
      return MapRecordSortableField.Rank;
    default:
      return undefined;
  }
}
