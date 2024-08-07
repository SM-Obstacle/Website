import { MPFormatLink } from "@/components/MPFormat";
import { Table, Thead, Tr, Th, Tbody, Td } from "@/components/Table";
import Time, { formatFull, Date } from "@/components/Time";
import { ToolBarWrapper, ToolbarSpan } from "@/components/ToolbarWrapper";
import MxButton from "./MxButton";
import { MapRecordsProperty } from "./page";

export function MapRecordsContent<Q extends MapRecordsProperty>({
  data,
  toolbarTitle,
}: {
  data: Q;
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
          {data.map.records.map((record) => (
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
              <Td date respvAbsoluteDate title={formatFull(record.recordDate)}>
                <Date onlyDate>{record.recordDate}</Date>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
