import { GetCampaignPlayerInfoQuery, Medal } from "@/app/__generated__/graphql";
import PlayerToolbar from "@/app/player/[login]/PlayerToolbar";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table";
import GroupedRows from "./GroupedRows";
import { FaCircle } from "react-icons/fa";
import { Box, Flex, styled } from "../../../../../styled-system/jsx";
import { MPFormatLink } from "@/components/MPFormat";
import Image, { ImageProps } from "next/image";
import { cmpMedals } from "@/lib/utils";
import Time from "@/components/Time";
import { CampaignPrefixSpan } from "@/components/CampaignMain";

const getImg = (medal: string) => `/Medals/${medal}.png`;

const MedalImg = ({ mdl }: { mdl: Medal | null }) => mdl && (
  <Image
    src={getImg(mdl.toLowerCase())}
    alt={mdl}
    width={20}
    height={20}
  />
);

const CategoryName = styled(Td, {
  base: {
    flex: .9,
    display: "flex",
    gap: 2,
    justifyContent: "flex-start",
    alignItems: "center,"
  }
});

type Data = NonNullable<GetCampaignPlayerInfoQuery["event"]["edition"]>["player"];

function reduceMedals<T extends { medal: Medal | null }>(input: T[]) {
  return input.reduce((medalAcc: Medal | null, elem) => {
    const cmp = cmpMedals(medalAcc, elem.medal);
    return cmp >= 0 ? elem.medal : medalAcc;
  }, Medal.Champion);
}

function insertMedalsIn(data: Data) {
  const categoriesRanksWithMedals = {
    ...data,
    categorizedRanks: data.categorizedRanks.map((category) => ({
      ...category,
      ranks: category.ranks.map((rank) => ({
        ...rank,
        medal: rank.time < rank.map.medalTimes.championTime ? Medal.Champion
          : rank.time < rank.map.medalTimes.goldTime ? Medal.Gold
            : rank.time < rank.map.medalTimes.silverTime ? Medal.Silver
              : rank.time < rank.map.medalTimes.bronzeTime ? Medal.Bronze
                : null
      }))
    }))
  } satisfies Data;

  const categoriesWithMedals = {
    ...categoriesRanksWithMedals,
    categorizedRanks: categoriesRanksWithMedals.categorizedRanks.map((category) => ({
      ...category,
      medal: category.ranks.length < category.nbMaps ? null
        : reduceMedals(category.ranks),
    }))
  } satisfies typeof categoriesRanksWithMedals;

  const withMedals = {
    ...categoriesWithMedals,
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
      }
    },
  }
});

export default function DialogContent({
  eventHandle,
  editionId,
  eventName,
  data,
  nbMaps,
}: {
  eventHandle: string,
  editionId: number,
  eventName: string | null | undefined,
  data: Data
  nbMaps: number,
}) {
  const dataWithMedals = insertMedalsIn(data);

  return (
    <>
      <PlayerToolbar
        role={data.player.role}
        zonePath={data.player.zonePath}
      >
        <MPFormatLink
          path={`/player/${data.player.login}`}
          name={data.player.name}
        />
        {" on "}{eventName}
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
          <Td rank respvUnpadRank>{dataWithMedals.rank}</Td>
          <Td campaignAttr player>{dataWithMedals.rankAvg}</Td>
          <Td campaignAttr alignRightSm>
            <span>
              {dataWithMedals.mapFinished}
              <small>/{nbMaps}</small>
            </span>
          </Td>
          <Td campaignAttr date hideRespv>{dataWithMedals.worstRank}</Td>
        </EventRowInfo>

        <hr />

        {/**
         * Unfinished maps
         */}

        {data.unfinishedMaps.length > 0 && (
          <>
            <GroupedRows head={<CategoryName>Unfinished maps</CategoryName>}>
              <Flex alignItems="center" justifyContent="space-between">
                <Th>Map</Th>
                <Th textAlign="right" minWidth={200}>Last rank</Th>
              </Flex>
              {data.unfinishedMaps.map((map) => (
                <Tr bgColor="black!" key={map.map.gameId}>
                  <Td map respvMb>
                    <MPFormatLink
                      path={`/event/${eventHandle}/${editionId}/map/${map.map.gameId}`}
                      name={map.map.name}
                    />
                  </Td>
                  <Td textAlign="right">{map.lastRank}</Td>
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
          <Th flex={.1} textAlign="right"><MedalImg mdl={dataWithMedals.medal} /></Th>
        </Flex>

        {dataWithMedals.categorizedRanks.map((category, i) => category.ranks.length > 0 && (
          <GroupedRows
            key={i}
            medal={<MedalImg mdl={category.medal} />}
            head={<CategoryName>
              {category.hexColor && <FaCircle color={`#${category.hexColor}`} />}
              {category.categoryName}
            </CategoryName>}
          >
            <Flex alignItems="center">
              <Th rank hideRespv>Rank</Th>
              <Th map padRespvFirst>Map</Th>
              <Th time padRespvLast hideRespv>Time</Th>
              <Th hideRespv medal>Medals</Th>
            </Flex>
            {category.ranks.map((rank, j) => (
              <Tr bgColor="black!" key={j}>
                <Td rank respvUnpadRank>{rank.rank}<small>/{rank.map.lastRank}</small></Td>
                <Td map respvMb>
                  <MPFormatLink
                    path={`/event/${eventHandle}/${editionId}/map/${rank.map.map.gameId}`}
                    name={rank.map.map.name} />
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
        ))}
      </Tbody>
    </>
  );
}