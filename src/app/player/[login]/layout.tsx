import type { Metadata } from "next";

import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import PageShell from "@/components/layout/PageShell";
import { Panel, SubPanel } from "@/components/layout/Panel";
import PageTitle from "@/components/layout/PageTitle";
import SectionHeader from "@/components/layout/SectionHeader";
import MPFormat from "@/components/MPFormat";
import WithDetailAside from "@/components/layout/WithDetailAside";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import PlayerAside from "./PlayerAside";
import PlayerInfo from "./PlayerInfo";
import Link from "next/link";
import LoadErrorPanel from "@/components/layout/LoadErrorPanel";
import catchGqlError from "@/lib/catchError";

const GET_PLAYER_INFO = gql(/* GraphQL */ `
  query GetPlayer($login: String!) {
    player(login: $login) {
      login
      name
      score
      zonePath
      role
    }
  }
`);

export async function generateMetadata(
  props: LayoutProps<"/player/[login]">,
): Promise<Metadata> {
  const { login } = await props.params;
  const { data } = await query({
    query: GET_PLAYER_INFO,
    variables: { login },
  }).catch(catchGqlError);

  return { title: data ? toPlainText(parse(data.player.name)) : login };
}

export default async function PlayerLayout(
  props: LayoutProps<"/player/[login]">,
) {
  const { login } = await props.params;

  const { data, error } = await query({
    query: GET_PLAYER_INFO,
    variables: { login },
  }).catch(catchGqlError);

  if (error || !data) {
    return (
      <PageShell
        titleSegments={[<PageTitle key="title">Players</PageTitle>]}
        selectedMenu="players"
      >
        <LoadErrorPanel title="Invalid player">
          Could not load this player: {error?.message ?? "unknown error"}
        </LoadErrorPanel>
      </PageShell>
    );
  }

  return (
    <PageShell
      titleSegments={[
        <PageTitle key="title">
          <Link href="/players">Players</Link>
        </PageTitle>,
        <PageTitle key="player">
          <MPFormat>{data.player.name}</MPFormat>
        </PageTitle>,
      ]}
      selectedMenu="players"
    >
      <WithDetailAside aside={<PlayerAside player={data.player} />}>
        <div className="mx-auto flex h-full min-h-0 w-full max-w-content flex-col gap-2 [--profile-picture-size:75px] lg:[--profile-picture-size:100px]">
          <PlayerInfo player={data.player} />

          <Panel
            className="flex min-h-0 flex-1 flex-col"
            header={
              <SectionHeader
                title="Latest records"
                // Exact: this player's own records, not those of every
                // player whose login contains this one.
                href={`/records?playerLogin=${encodeURIComponent(
                  data.player.login,
                )}&playerLoginExact=1`}
              />
            }
          >
            {props.children}
          </Panel>
        </div>
      </WithDetailAside>
    </PageShell>
  );
}
