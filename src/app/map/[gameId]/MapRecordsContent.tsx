import { MPFormatLink } from "@/components/MPFormat";
import { Table, Thead, Tr, Th, Tbody, Td } from "@/components/Table";
import Time from "@/components/Time";
import Date from "@/components/Date";
import { ToolBarWrapper, ToolbarSpan } from "@/components/ToolbarWrapper";
import MxButton from "./MxButton";
import { MapContent, MedalRecord, RankedRecordLine } from "@/lib/map-page-types";
import { MedalImg } from "@/components/MedalImg";
import { Medal } from "@/lib/ranked-record";

const medalToText = (mdl: Medal) => {
  if (mdl === Medal.Champion) {
    return "Author time";
  }
  return `${mdl[0] + mdl.slice(1).toLowerCase()} time`;
}

export function MapRecordsContent({
  data,
  toolbarTitle,
}: {
  data: MapContent;
  toolbarTitle: React.ReactNode;
}) {
  let cpsNumberText = "";
  const cpsNumber = data.map.cpsNumber;
  if (typeof cpsNumber === "number") {
    cpsNumberText = `${cpsNumber} cp${cpsNumber > 1 ? "s" : ""}`;
  }

  return (
    <>
      <ToolBarWrapper>
        {toolbarTitle}
        <ToolbarSpan>{cpsNumberText}</ToolbarSpan>
        <ToolbarSpan>
          By{" "}
          <MPFormatLink
            path={`/player/${data.map.player.login}`}
            name={data.map.player.name}
          />
        </ToolbarSpan>
        <MxButton gameId={data.map.gameId} />
      </ToolBarWrapper>

      <Table>
        <Thead>
          <Tr>
            <Th rank hideRespv>
              <span>Rank</span>
            </Th>
            <Th player padRespvFirst>
              <span>Player</span>
            </Th>
            <Th time padRespvLast>
              <span>Time</span>
            </Th>
            <Th date hideRespv>
              <span>Date</span>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map.records.map((record) => record instanceof RankedRecordLine ? (
            <Tr key={record.id}>
              <Td rank respvUnpadRank>
                {record.rank}
              </Td>
              <Td player respvMb>
                <MPFormatLink
                  path={`/player/${record.player.login}`}
                  name={record.player.name}
                />
              </Td>
              <Td time respvTime>
                <Time>{record.time}</Time>
              </Td>
              <Td date respvAbsoluteDate>
                <Date onlyDate>{record.recordDate}</Date>
              </Td>
            </Tr>
          ) : record instanceof MedalRecord ? (
            <Tr key={`record_medal_${record.medal}`}>
              <Td rank respvUnpadRank>
                <MedalImg mdl={record.medal} />
              </Td>
              <Td player respvMb>
                {medalToText(record.medal)}
              </Td>
              <Td time respvTime>
                <Time>{record.time}</Time>
              </Td>
              <Td date respvAbsoluteDate></Td>
            </Tr>
          ) : null)}
        </Tbody>
      </Table>
    </>
  );
}
