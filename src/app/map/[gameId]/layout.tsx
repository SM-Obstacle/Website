import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import PageBase from "@/components/ui/organisms/PageBase";
import { css } from "../../../../@shadow-panda/styled-system/css";
import { H1, H2 } from "@/components/ui/atoms/typography";
import MPFormat from "@/components/MPFormat";
import MapInfo from "./MapInfo";
import Block from "@/components/ui/organisms/Block";
import SeeMoreTitle from "@/components/ui/organisms/SeeMoreTitle";

const GET_MAP_INFO = gql(/* GraphQL */ `
  query GetMap($gameId: String!) {
    map(gameId: $gameId) {
      gameId
      name
      cpsNumber
      player {
        login
        name
      }
      relatedEventEditions {
        map {
          gameId
        }
        redirectToEvent
        edition {
          name
          subtitle
          event {
            handle
          }
          id
        }
      }
    }
  }
`);

export default async function PlayerLayout(
  props: LayoutProps<"/map/[gameId]">,
) {
  const params = await props.params;
  const gameId = params.gameId;

  const { data } = await query({
    query: GET_MAP_INFO,
    variables: { gameId },
  });

  return data === undefined ? (
    "Something went wrong"
  ) : (
    <PageBase titleSegments={[<H1>Maps</H1>]} selectedMenu="maps">
      <div
        className={css({
          "--profile-picture-size": "100px",
          display: "flex",
          flexDirection: "column",
          gap: "token(spacing.2)",
          height: "100%",
          maxW: "token(sizes.maxContentWidth)",
          margin: "auto",
        })}
      >
        <MapInfo map={data.map} />
        <div className={css({ flexGrow: 1, height: "100%" })}>
          <Block
            titleBar={
              <SeeMoreTitle
                title="Leaderboard"
                buttonHref={`/records?mapUid=${data.map.gameId}`}
              />
            }
          >
            <div
              className={css({
                display: "flex",
                flexDir: "column",
                gap: "token(spacing.2)",
                height: "100%",
              })}
            >
              {props.children}
            </div>
          </Block>
        </div>
      </div>
    </PageBase>
  );
}
