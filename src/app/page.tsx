import PageBase from "@/components/ui/organisms/PageBase";
import Block, { SubBlock } from "@/components/ui/organisms/Block";
import { H1 } from "@/components/ui/atoms/typography";
import CurrentEvents from "@/components/with-suspense/CurrentEvents";
import LatestRecords from "@/components/with-suspense/LatestRecords";
import MapOfTheWeek from "@/components/with-suspense/MapOfTheWeek";
import PlayerOfTheWeek from "@/components/with-suspense/PlayerOfTheWeek";
import { css } from "../../@shadow-panda/styled-system/css";
import SeeMoreTitle from "@/components/ui/organisms/SeeMoreTitle";

export default function Home() {
  return (
    <PageBase titleSegments={[<H1>Home</H1>]} selectedMenu="home">
      <div
        className={css({
          height: "100%",
          maxW: "token(sizes.maxContentWidth)",
          margin: "auto",

          display: "flex",
          flexDir: "column",
          gap: "token(spacing.2)",

          md: {
            display: "grid",
            gridGap: "token(spacing.2)",
            gridTemplateRows: "min-content auto auto",
            gridTemplateColumns: "1fr 1fr",
          },
        })}
      >
        {/* Latest records */}
        <Block
          className={css({
            minW: 0,
            gridColumn: "1 / -1",
            gridRow: 1,
          })}
          titleBar={
            <SeeMoreTitle title="Latest records" buttonHref="/records" />
          }
        >
          <SubBlock minW={0}>
            <LatestRecords />
          </SubBlock>
        </Block>

        <Block
          className={css({
            gridColumn: 1,
            gridRow: 2,
          })}
          titleBar={
            <SeeMoreTitle title="Player of the week" buttonHref="/players" />
          }
        >
          <SubBlock
            className={css({
              height: "100%",
            })}
          >
            <PlayerOfTheWeek />
          </SubBlock>
        </Block>

        <Block
          className={css({
            gridColumn: 2,
            gridRow: 2,
          })}
          titleBar={<SeeMoreTitle title="Map of the week" buttonHref="/maps" />}
        >
          <SubBlock
            className={css({
              height: "100%",
            })}
          >
            <MapOfTheWeek />
          </SubBlock>
        </Block>

        <Block
          className={css({
            gridRow: 3,
            gridColumn: "1 / -1",
          })}
          titleBar={
            <SeeMoreTitle title="Current events" buttonHref="/events" />
          }
        >
          <CurrentEvents />
        </Block>
      </div>
    </PageBase>
  );
}
