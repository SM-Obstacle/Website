import { GetPlayerQuery, PlayerRole } from "@/app/__generated__/graphql";
import { H2, H3 } from "@/components/ui/atoms/typography";
import Block, { SubBlock } from "@/components/ui/organisms/Block";
import { css } from "../../../../@shadow-panda/styled-system/css";
import MPFormat from "@/components/MPFormat";
import { FaAt, FaCalendar, FaFlag, FaPerson, FaUser } from "react-icons/fa6";
import { getJSDocOverrideTagNoCache } from "typescript";
import { Badge } from "@/components/ui/molecules/Badge";
import { CiMedal } from "react-icons/ci";
import { FaRunning } from "react-icons/fa";

function PlayerZone({ zonePath }: { zonePath: string | null | undefined }) {
  if (!zonePath) return null;
  const [world, continent, country] = zonePath.split("|").slice(0, 3);

  return (
    <span>
      <span
        className={css({
          display: "none",
          md: {
            display: "revert",
          },
        })}
      >
        {world}/{continent}/
      </span>
      <span>{country}</span>
    </span>
  );
}

export default function PlayerInfo({
  player,
}: {
  player: GetPlayerQuery["player"];
}) {
  return (
    <Block
      className={css({
        display: "flex",
        flexDir: "row",
        alignItems: "center",
      })}
    >
      {/* "Profile picture" */}
      <div
        className={css({
          aspectRatio: "1 / 1",
          width: "calc(var(--profile-picture-size) * 0.75)",
          rounded: "full",
          bgColor: "black",
          margin: "token(spacing.3)",
          lg: {
            width: "var(--profile-picture-size)",
          },
        })}
      >
        <FaUser
          className={css({
            width: "30%",
            height: "100%",
            margin: "auto",
          })}
        />
      </div>

      {/* Player info */}
      <SubBlock
        className={css({
          width: "100%",
          height: "100%",
          padding: "token(spacing.2) token(spacing.5)",

          display: "grid",
          gridTemplateRows: "auto 1fr",
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
          <MPFormat>{player.name}</MPFormat>
        </H2>

        {/* Badges */}
        <div
          className={css({
            gridRow: 2,
            gridColumn: "1 / -1",

            height: "fit-content",
            display: "flex",
            flexDir: "row",
            gap: "token(spacing.2)",
            flexWrap: "wrap",
          })}
        >
          <Badge variant="secondary">
            <FaAt className={css({ me: "token(spacing.1) " })} />
            <code>{player.login}</code>
          </Badge>

          <Badge variant="secondary">
            <FaCalendar className={css({ me: "token(spacing.1) " })} />
            Join date: 01/01/0001
          </Badge>

          <Badge variant="secondary">
            <FaFlag className={css({ me: "token(spacing.1) " })} />
            <PlayerZone zonePath={player.zonePath} />
          </Badge>

          <Badge variant="secondary">
            <FaRunning className={css({ me: "token(spacing.1) " })} />
            Record amount: 2834
          </Badge>

          <Badge variant="secondary">
            <CiMedal className={css({ me: "token(spacing.1) " })} />
            Global rank: 245
          </Badge>
        </div>

        {/* Player role */}
        <Badge
          variant={
            player.role === PlayerRole.Admin ? "destructive" : "secondary"
          }
          className={css({
            display: "none",
            md: {
              display: "revert",
              gridRow: 1,
              gridColumn: 3,
              height: "fit-content",
              margin: "auto",
            },
          })}
        >
          {player.role}
        </Badge>
      </SubBlock>
    </Block>
  );
}
