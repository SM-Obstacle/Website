import { FaCircle } from "react-icons/fa";
import type { GetCampaignPlayerInfoQuery } from "@/app/__generated__/graphql";
import PlayerToolbar from "@/app/player/[login]/PlayerToolbar";
import { CampaignPrefixSpan } from "@/components/CampaignMain";
import { MedalImg } from "@/components/MedalImg";
import { MPFormatLink } from "@/components/MPFormat";
import { Tbody, Td, Th, Tr } from "@/components/Table";
import Time from "@/components/Time";
import { Medal } from "@/lib/ranked-record";
import { cmpMedals } from "@/lib/utils";
import { Flex, styled } from "../../../../../styled-system/jsx";
import GroupedRows from "./GroupedRows";

const CategoryName = styled(Td, {
  base: {
    flex: 0.9,
    display: "flex",
    gap: 2,
    justifyContent: "flex-start",
    alignItems: "center,",
  },
});

type Data = NonNullable<
  GetCampaignPlayerInfoQuery["event"]["edition"]
>["player"];

function reduceMedals<T extends { medal: Medal | null }>(input: T[]) {
  return input.reduce((medalAcc: Medal | null, elem) => {
    const cmp = cmpMedals(medalAcc, elem.medal);
    return cmp >= 0 ? elem.medal : medalAcc;
  }, Medal.Champion);
}

function insertMedalsIn(data: Data) {
  const medalCount = {
    bronze: 0,
    silver: 0,
    gold: 0,
    champion: 0,
  };

  const categoriesRanksWithMedals = {
    ...data,
    categorizedRanks: data.categorizedRanks.map((category) => ({
      ...category,
      ranks: category.ranks.map((rank) => ({
        ...rank,
        medal:
          rank.time <= (rank.map.medalTimes?.championTime || -1)
            ? (() => {
                medalCount.champion++;
                return Medal.Champion;
              })()
            : rank.time <= (rank.map.medalTimes?.goldTime || -1)
              ? (() => {
                  medalCount.gold++;
                  return Medal.Gold;
                })()
              : rank.time <= (rank.map.medalTimes?.silverTime || -1)
                ? (() => {
                    medalCount.silver++;
                    return Medal.Silver;
                  })()
                : rank.time <= (rank.map.medalTimes?.bronzeTime || -1)
                  ? (() => {
                      medalCount.bronze++;
                      return Medal.Bronze;
                    })()
                  : null,
      })),
    })),
  } satisfies Data;

  const categoriesWithMedals = {
    ...categoriesRanksWithMedals,
    categorizedRanks: categoriesRanksWithMedals.categorizedRanks.map(
      (category) => ({
        ...category,
        medal:
          category.ranks.length < category.nbMaps
            ? null
            : reduceMedals(category.ranks),
      }),
    ),
  } satisfies typeof categoriesRanksWithMedals;

  const withMedals = {
    ...categoriesWithMedals,
    medalCount,
    medal: reduceMedals(categoriesWithMedals.categorizedRanks),
  };

  return withMedals;
}

const EventRowInfo = styled(Flex, {
  base: {
    justifyContent: "space-evenly",
    alignItems: "center",
    tableLayout: "fixed",
  },
  variants: {
    head: {
      true: {
        pe: "10px",
        "@media only screen and (max-width: 870px)": {
          ps: "40px",
        },
      },
    },
  },
});

export default function DialogContent({
  eventHandle,
  editionId,
  eventName,
  data,
  nbMaps,
}: {
  eventHandle: string;
  editionId: number;
  eventName: string | null | undefined;
  data: Data;
  nbMaps: number;
}) {
  const dataWithMedals = insertMedalsIn(data);
  const hasMedals = dataWithMedals.categorizedRanks.some((rank) =>
    rank.ranks.some((rank) => rank.map.medalTimes),
  );

  return (
    <>
      <PlayerToolbar role={data.player.role} zonePath={data.player.zonePath}>
        <MPFormatLink
          path={`/player/${data.player.login}`}
          name={data.player.name}
        />
        {" on "}
        {eventName}
      </PlayerToolbar>

      <Tbody>
        {/**
         * Event row info
         */}

        <EventRowInfo head>
          <Th rank hideRespv>
            <span>Rank</span>
          </Th>
          <Th campaignAttr padRespvFirst player>
            <CampaignPrefixSpan>Rank </CampaignPrefixSpan>
            <span>Average</span>
          </Th>
          <Th campaignAttr alignRightSm>
            <CampaignPrefixSpan>Map </CampaignPrefixSpan>
            <span>Finished</span>
          </Th>
          <Th campaignAttr date hideRespv>
            <span>Worst</span>
            <CampaignPrefixSpan> Rank</CampaignPrefixSpan>
          </Th>
        </EventRowInfo>
        <EventRowInfo>
          <Td rank respvUnpadRank>
            {dataWithMedals.rank}
          </Td>
          <Td campaignAttr player>
            {dataWithMedals.rankAvg}
          </Td>
          <Td campaignAttr alignRightSm>
            <span>
              {dataWithMedals.mapFinished}
              <small>/{nbMaps}</small>
            </span>
          </Td>
          <Td campaignAttr date hideRespv>
            {dataWithMedals.worstRank}
          </Td>
        </EventRowInfo>

        {hasMedals && (
          <>
            <hr />

            <Flex justifyContent="center" alignItems="center" gap={10}>
              <Flex alignItems="center" gap={2}>
                {dataWithMedals.medalCount.bronze}{" "}
                <MedalImg mdl={Medal.Bronze} />
              </Flex>
              <Flex alignItems="center" gap={2}>
                {dataWithMedals.medalCount.silver}{" "}
                <MedalImg mdl={Medal.Silver} />
              </Flex>
              <Flex alignItems="center" gap={2}>
                {dataWithMedals.medalCount.gold} <MedalImg mdl={Medal.Gold} />
              </Flex>
              <Flex alignItems="center" gap={2}>
                {dataWithMedals.medalCount.champion}{" "}
                <MedalImg mdl={Medal.Champion} />
              </Flex>
            </Flex>
          </>
        )}

        <hr />

        {/**
         * Unfinished maps
         */}

        {data.unfinishedMaps.length > 0 && (
          <>
            <GroupedRows head={<CategoryName>Unfinished maps</CategoryName>}>
              <Flex alignItems="center" justifyContent="space-between">
                <Th>Map</Th>
                <Th textAlign="right" minWidth={200}>
                  Last rank
                </Th>
              </Flex>
              {data.unfinishedMaps.map((map) => (
                <Tr bgColor="black!" key={map.map.gameId}>
                  <Td map respvMb>
                    <MPFormatLink
                      path={`/event/${eventHandle}/${editionId}/map/${map.map.gameId}`}
                      name={map.map.name}
                    />
                  </Td>
                  {map.lastRank > 0 && (
                    <Td textAlign="right">{map.lastRank}</Td>
                  )}
                </Tr>
              ))}
            </GroupedRows>

            <hr />
          </>
        )}

        {/**
         * Finished maps
         */}

        <Flex justifyContent="flex-start">
          <Th flex={1}>Finished maps</Th>
          <Th flex={0.1} textAlign="right">
            <MedalImg mdl={dataWithMedals.medal} />
          </Th>
        </Flex>

        {dataWithMedals.categorizedRanks.map(
          (category) =>
            category.ranks.length > 0 && (
              <GroupedRows
                key={category.categoryName}
                medal={<MedalImg mdl={category.medal} />}
                head={
                  <CategoryName>
                    {category.hexColor && (
                      <FaCircle color={`#${category.hexColor}`} />
                    )}
                    {category.categoryName}
                  </CategoryName>
                }
              >
                <Flex alignItems="center">
                  <Th rank hideRespv>
                    Rank
                  </Th>
                  <Th map padRespvFirst>
                    Map
                  </Th>
                  <Th time padRespvLast hideRespv>
                    Time
                  </Th>
                  <Th hideRespv medal>
                    Medals
                  </Th>
                </Flex>
                {category.ranks.map((rank) => (
                  <Tr
                    bgColor="black!"
                    key={`${category.categoryName}_${rank.map.map.gameId}`}
                  >
                    <Td rank respvUnpadRank>
                      {rank.rank}
                      <small>/{rank.map.lastRank}</small>
                    </Td>
                    <Td map respvMb>
                      <MPFormatLink
                        path={`/event/${eventHandle}/${editionId}/map/${rank.map.map.gameId}`}
                        name={rank.map.map.name}
                      />
                    </Td>
                    <Td time respvTime>
                      <Time>{rank.time}</Time>
                    </Td>
                    <Td medal>
                      <MedalImg mdl={rank.medal} />
                    </Td>
                  </Tr>
                ))}
              </GroupedRows>
            ),
        )}
      </Tbody>
    </>
  );
}
