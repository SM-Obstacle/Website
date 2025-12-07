import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import { css } from "../../../@shadow-panda/styled-system/css";
import { SubBlock } from "../ui/Block";
import { H3 } from "../ui/typography";

const GET_EVENTS = gql(/* GraphQL */ `
  query GetEventList {
    events {
      handle
      lastEdition {
        id
      }
    }
  }
`);

export default async function CurrentEvents() {
  const { data } = await query({ query: GET_EVENTS });

  return (
    <div
      className={css({
        flexGrow: 1,
        display: "flex",
        flexDir: "row",
        gap: "token(spacing.2)",
        "& *": {
          flexGrow: 1,
        },
      })}
    >
      {(data?.events ?? [])
        .filter((event) => event.lastEdition !== null)
        .slice(0, 2)
        .map((event) => (
          <SubBlock key={event.handle}>
            <div
              className={css({
                display: "flex",
                flexDir: "column",
              })}
            >
              <H3>{event.handle}</H3>
            </div>
          </SubBlock>
        ))}
    </div>
  );
}
