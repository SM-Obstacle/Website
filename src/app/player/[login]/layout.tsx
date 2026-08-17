import type { Metadata } from "next";

import { gql } from "@/app/__generated__";
import { query } from "@/app/ApolloClient";
import PageShell from "@/components/layout/PageShell";
import { Panel } from "@/components/layout/Panel";
import PageTitle from "@/components/layout/PageTitle";
import SectionHeader from "@/components/layout/SectionHeader";
import MPFormat from "@/components/MPFormat";
import WithRecordAside from "@/components/records/WithRecordAside";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import PlayerInfo from "./PlayerInfo";

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
    errorPolicy: "all",
  });

  return { title: data ? toPlainText(parse(data.player.name)) : login };
}

export default async function PlayerLayout(
  props: LayoutProps<"/player/[login]">,
) {
  const { login } = await props.params;

  const { data, error } = await query({
    query: GET_PLAYER_INFO,
    variables: { login },
    errorPolicy: "all",
  });

  if (error || !data) {
    return (
      <PageShell
        titleSegments={[<PageTitle key="title">Players</PageTitle>]}
        selectedMenu="players"
      >
        <Panel className="m-auto p-8">
          Could not load this player: {error?.message ?? "unknown error"}
        </Panel>
      </PageShell>
    );
  }

  return (
    <PageShell
      titleSegments={[
        <PageTitle key="title">Players</PageTitle>,
        <PageTitle key="player">
          <MPFormat>{data.player.name}</MPFormat>
        </PageTitle>,
      ]}
      selectedMenu="players"
    >
      <WithRecordAside>
        <div className="mx-auto flex h-full min-h-0 w-full max-w-content flex-col gap-2 [--profile-picture-size:75px] lg:[--profile-picture-size:100px]">
          <PlayerInfo player={data.player} />

          <Panel
            className="flex min-h-0 flex-1 flex-col"
            header={
              <SectionHeader
                title="Latest records"
                href={`/records?playerLogin=${data.player.login}`}
              />
            }
          >
            {props.children}
          </Panel>
        </div>
      </WithRecordAside>
    </PageShell>
  );
}
