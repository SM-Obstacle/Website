import {
  PlayerMapRankingSort,
  PlayerMapRankingSortableField,
  SortOrder,
  UnorderedRecordSort,
  UnorderedRecordSortableField,
} from "@/app/__generated__/graphql";
import { ReadableParams } from "./filters";

export interface OrderVariable {
  order?: SortOrder;
}

function readOrderVariable(params: ReadableParams): OrderVariable {
  const rawOrder = params.get("order");
  const order = (() => {
    switch (rawOrder) {
      case "asc":
        return SortOrder.Ascending;
      case "desc":
        return SortOrder.Descending;
    }
    return undefined;
  })();
  return { order };
}

type SortableFieldMap = {
  unorderedRecords: UnorderedRecordSortableField;
  playerMapRanking: PlayerMapRankingSortableField;
};

export type SortableFields = keyof SortableFieldMap;

interface FieldVariable<F extends SortableFields> {
  field?: SortableFieldMap[F];
}

function readFieldVariable<F extends SortableFields>(
  params: ReadableParams,
  fields: F,
): FieldVariable<F> {
  const rawSort = params.get("sort")?.toLowerCase() || undefined;
  const field = (() => {
    switch (fields) {
      case "unorderedRecords": {
        return UnorderedRecordSortableField.Date;
      }
      case "playerMapRanking":
        switch (rawSort) {
          case "rank":
            return PlayerMapRankingSortableField.Rank;
          case "name":
            return PlayerMapRankingSortableField.Name;
        }
    }
    return undefined;
  })();
  return { field } as FieldVariable<F>;
}

export interface SortVariables<F extends SortableFields>
  extends OrderVariable, Required<FieldVariable<F>> {}

export interface SortInputVariables<F extends SortableFields> {
  sort?: SortVariables<F>;
}

export function readSort<F extends SortableFields>(
  params: ReadableParams,
  fields: F,
): SortInputVariables<F> {
  const field = readFieldVariable(params, fields);
  const order = readOrderVariable(params);
  return {
    sort: field.field ? { field: field.field, ...order } : undefined,
  };
}
