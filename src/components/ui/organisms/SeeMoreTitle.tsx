import { css } from "@shadow-panda/styled-system/css";
import { H2 } from "../atoms/typography";
import { Button } from "../molecules/Button";
import { LiaArrowRightSolid } from "react-icons/lia";
import Link from "next/link";

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

export default function SeeMoreTitle({
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
