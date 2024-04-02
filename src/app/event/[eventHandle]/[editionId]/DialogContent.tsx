import { GetCampaignPlayerInfoQuery, Medal } from "@/app/__generated__/graphql";
import PlayerToolbar from "@/app/player/[login]/PlayerToolbar";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/Table";
import GroupedRows from "./GroupedRows";
import { FaCircle } from "react-icons/fa";
import { Flex, styled } from "../../../../../styled-system/jsx";
import { MPFormatLink } from "@/components/MPFormat";
import Image, { ImageProps } from "next/image";
import { cmpMedals } from "@/lib/utils";

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

export default function DialogContent({
  eventHandle,
  editionId,
  eventName,
  data,
}: {
  eventHandle: string,
  editionId: number,
  eventName: string | null | undefined,
  data: Data
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

      <Table>
        <Thead>
          <Tr justifyContent="flex-start">
            <Th flex={1}>Category</Th>
            <Th flex={.1} textAlign="right"><MedalImg mdl={dataWithMedals.medal} /></Th>
          </Tr>
        </Thead>
        <Tbody>
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
                <Th hideRespv textAlign="right" minWidth={200}>Medals</Th>
              </Flex>
              {category.ranks.map((rank, j) => (
                <Tr bgColor="black!" key={j}>
                  <Td rank respvUnpadRank>{rank.rank}<small>/{rank.map.lastRank}</small></Td>
                  <Td map respvMb>
                    <MPFormatLink
                      path={`/event/${eventHandle}/${editionId}/map/${rank.map.map.gameId}`}
                      name={rank.map.map.name} />
                  </Td>
                  <Td textAlign="right" minWidth={200}>
                    <MedalImg mdl={rank.medal} />
                  </Td>
                </Tr>
              ))}
            </GroupedRows>
          ))}
        </Tbody>
      </Table>
    </>
  );
}