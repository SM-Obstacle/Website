import {
  MapRecordSort,
  MapRecordSortableField,
  SortOrder,
} from "@/app/__generated__/graphql";

// NOTE: this will likely get a merge conflict with branch ui-redesign, just take the version
// of ui-redesign

export function parseMapSort(
  rawField?: string,
  rawOrder?: string,
): MapRecordSort | undefined {
  let order: SortOrder | undefined;
  switch (rawOrder?.toLowerCase().trim()) {
    case "desc":
      order = SortOrder.Descending;
      break;
    case "asc":
      order = SortOrder.Ascending;
      break;
    default:
      order = undefined;
      break;
  }

  const trimmedField = rawField?.toLowerCase().trim();
  if (trimmedField === "date") {
    return {
      field: MapRecordSortableField.Date,
      order,
    };
  } else if (trimmedField === "rank" || order) {
    return {
      field: MapRecordSortableField.Rank,
      order,
    };
  }

  return undefined;
}
