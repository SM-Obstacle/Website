import Link from "next/link";
import { LiaArrowRightSolid } from "react-icons/lia";
import PageBase from "@/components/PageBase";
import Block, { SubBlock } from "@/components/ui/Block";
import { Button } from "@/components/ui/Button";
import { H1, H2 } from "@/components/ui/typography";
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
          ".4s ease-out --color-gradient-1, .4s ease-out --color-gradient-2",

        paddingBlock: "unset",
        paddingInlineStart: "10px",
        paddingInlineEnd: "10px",
        fontSize: "lg",
        background:
          "linear-gradient(-0.21turn, var(--color-gradient-2), var(--color-gradient-1))",

        _hover: {
          "--color-gradient-1": "token(colors.buttonPrimaryDarkBlue)",
          "--color-gradient-2": "token(colors.buttonPrimaryDarkBlueHover)",

          "& > *:last-child": {
            left: 1,
          },
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
      <H2>{title}</H2>
      <SeeMoreButton href={buttonHref} />
    </div>
  );
}

export default function Home() {
  return (
    <PageBase titleSegments={[<H1 key="title">Home</H1>]} selectedMenu="home">
      <div
        className={css({
          height: "100%",
          display: "flex",
          flexDir: "column",
          maxWidth: "token(sizes.maxContentWidth)",
          margin: "auto",
          gap: "token(spacing.2)",
        })}
      >
        {/* Latest records */}
        <Block
          titleBar={
            <SeeMoreTitle title="Latest records" buttonHref="/records" />
          }
        >
          <SubBlock>
            <LatestRecords />
          </SubBlock>
        </Block>

        {/* ... of the week */}
        <div
          className={css({
            flexGrow: 1,
            display: "flex",
            flexDir: "row",
            gap: "token(spacing.2)",
            "& > *": {
              flexGrow: 1,
            },
          })}
        >
          <Block
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
            titleBar={
              <SeeMoreTitle title="Map of the week" buttonHref="/maps" />
            }
          >
            <SubBlock
              className={css({
                height: "100%",
              })}
            >
              <MapOfTheWeek />
            </SubBlock>
          </Block>
        </div>

        {/* Events */}
        <Block
          className={css({ flexGrow: 1 })}
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
