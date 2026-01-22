import Link from "next/link";
import { LiaArrowRightSolid } from "react-icons/lia";
import PageBase from "@/components/ui/organisms/PageBase";
import Block, { SubBlock } from "@/components/ui/organisms/Block";
import { Button } from "@/components/ui/molecules/Button";
import { H1, H2 } from "@/components/ui/atoms/typography";
import CurrentEvents from "@/components/with-suspense/CurrentEvents";
import LatestRecords from "@/components/with-suspense/LatestRecords";
import MapOfTheWeek from "@/components/with-suspense/MapOfTheWeek";
import PlayerOfTheWeek from "@/components/with-suspense/PlayerOfTheWeek";
import { css } from "../../@shadow-panda/styled-system/css";

function SeeMoreButton({ href }: { href: string }) {
  return (
    <Button
      asChild
      rounded="full"
      className={css({
        "--color-gradient-1": "colors.buttonPrimaryLightBlue",
        "--color-gradient-2": "colors.buttonPrimaryDarkBlue",
        transition:
          ".4s ease-out --color-gradient-1, .4s ease-out --color-gradient-2, .1s ease-out border-color",

        textWrap: "nowrap",
        paddingBlock: "unset",
        paddingInlineStart: "10px",
        paddingInlineEnd: "10px",
        fontSize: "lg",
        background:
          "linear-gradient(-0.21turn, var(--color-gradient-2), var(--color-gradient-1))",
        border: "solid var(--color-gradient-2) 1px",
        color: "white",

        _hover: {
          "--color-gradient-1": "token(colors.buttonPrimaryDarkBlue)",
          "--color-gradient-2": "token(colors.buttonPrimaryDarkBlueHover)",

          "& > *:last-child": {
            left: 1,
          },
        },

        _active: {
          borderColor: "white",
        },
      })}
    >
      <Link className={css({ textDecoration: "none" })} href={href}>
        See more
        <LiaArrowRightSolid
          className={css({
            position: "relative",
            transition: ".3s ease-out left",
            left: 0,
          })}
        />
      </Link>
    </Button>
  );
}

function SeeMoreTitle({
  title,
  buttonHref,
}: {
  title: string;
  buttonHref: string;
}) {
  return (
    <div
      className={css({
        display: "flex",
        flexDir: "row",
        justifyContent: "space-between",
        alignItems: "center",
      })}
    >
      <H2
        className={css({
          fontWeight: "extrabold",
        })}
      >
        {title}
      </H2>
      <SeeMoreButton href={buttonHref} />
    </div>
  );
}

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
