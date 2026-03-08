import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import PageBase from "@/components/ui/organisms/PageBase";
import { css } from "../../../../@shadow-panda/styled-system/css";
import { H1, H2 } from "@/components/ui/atoms/typography";
import MPFormat from "@/components/MPFormat";
import PlayerInfo from "./PlayerInfo";
import Block from "@/components/ui/organisms/Block";
import SeeMoreTitle from "@/components/ui/organisms/SeeMoreTitle";

const GET_PLAYER_INFO = gql(/* GraphQL */ `
  query GetPlayer($login: String!) {
    player(login: $login) {
      login
      name
      zonePath
      role
    }
  }
`);

export default async function PlayerLayout(
  props: LayoutProps<"/player/[login]">,
) {
  const params = await props.params;
  const login = params.login;

  const { data } = await query({
    query: GET_PLAYER_INFO,
    variables: { login },
  });

  return data === undefined ? (
    "Something went wrong"
  ) : (
    <PageBase titleSegments={[<H1>Players</H1>]} selectedMenu="players">
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
        <PlayerInfo player={data.player} />
        <div className={css({ flexGrow: 1, height: "100%" })}>
          <Block
            titleBar={
              <SeeMoreTitle
                title="Latest records"
                buttonHref={`/records?playerLogin=${data.player.login}`}
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
