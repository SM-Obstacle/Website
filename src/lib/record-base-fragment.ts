import { gql } from "@/app/__generated__";

export const RECORD_BASE_FRAGMENT = gql(/* GraphQL */ `
  fragment RecordBase on RankedRecord {
    id
    rank
    time
    recordDate
  }
`);
