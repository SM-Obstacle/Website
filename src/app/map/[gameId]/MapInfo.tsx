import { GetMapQuery } from "@/app/__generated__/graphql";
import MPFormat, { MPFormatLink } from "@/components/MPFormat";
import { H2, H3 } from "@/components/ui/atoms/typography";
import Block, { SubBlock } from "@/components/ui/organisms/Block";
import { css } from "@shadow-panda/styled-system/css";
import { FaMap } from "react-icons/fa6";
import MxButton from "./MxButton";

export default function MapInfo({ map }: { map: GetMapQuery["map"] }) {
  return (
    <Block
      className={css({
        display: "flex",
        flexDir: "row",
        alignItems: "start",
      })}
    >
      {/* Map picture */}
      <div
        className={css({
          aspectRatio: "1 / 1",
          width: "calc(var(--profile-picture-size) * 0.75)",
          rounded: "calc(token(sizes.logoSize) / 2 - token(spacing.2))",
          bgColor: "black",
          margin: "token(spacing.3)",
          lg: {
            width: "var(--profile-picture-size)",
          },
        })}
      >
        <FaMap
          className={css({
            width: "30%",
            height: "100%",
            margin: "auto",
          })}
        />
      </div>

      {/* Map info */}
      <SubBlock
        className={css({
          width: "100%",
          height: "100%",
          padding: "token(spacing.2) token(spacing.5)",

          display: "grid",
          gridTemplateRows: "auto auto 1fr auto",
          gridTemplateColumns: "auto 1fr auto",
        })}
      >
        {/* Name */}
        <H2
          className={css({
            fontWeight: "bold",
            fontSize: "2xl",
          })}
        >
          <MPFormat>{map.name}</MPFormat>
        </H2>

        {/* Author */}
        <H3
          className={css({
            gridRow: 2,
          })}
        >
          by{" "}
          <MPFormatLink path={`/player/${map.player.login}`}>
            {map.player.name}
          </MPFormatLink>
        </H3>

        {/* Badges */}
        <div
          className={css({
            gridRow: 3,
            gridColumn: "1 / -1",
            height: "calc(4 * (1rem + token(spacing.0.5) + token(spacing.2)))",
          })}
        >
          <div
            className={css({
              display: "flex",
              flexDir: "row",
              gap: "token(spacing.2)",
              flexWrap: "wrap",
            })}
          ></div>
        </div>

        <div
          className={css({
            gridColumn: 3,
          })}
        >
          <MxButton gameId={map.gameId} />
        </div>
      </SubBlock>
    </Block>
  );
}
