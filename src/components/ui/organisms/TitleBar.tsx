import { FaChevronRight } from "react-icons/fa6";
import { css } from "../../../../@shadow-panda/styled-system/css";
import Bar from "../molecules/Bar";
import { Logo } from "./NavigationSideBar";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { H1 } from "../atoms/typography";

function Segments({ segments }: { segments: React.ReactNode[] }) {
  const boldSegments = segments.slice().map(
    (segment, i) =>
      (
        <div
          key={`__segment_${i}`}
          className={css({
            fontWeight: "black",
          })}
        >
          {segment}
        </div>
      ) as React.ReactNode,
  );
  for (let i = 0; i < boldSegments.length - 1; i++) {
    boldSegments.splice(
      ++i,
      0,
      <FaChevronRight
        key={`__sep_${i}`}
        className={css({ fontWeight: "bold", fontSize: "2xl" })}
      />,
    );
  }
  return boldSegments;
}

export default function TitleBar({
  segments,
  checkboxName,
  ...rest
}: {
  segments: React.ReactNode[];
  checkboxName: string;
} & React.ComponentProps<typeof Bar>) {
  return (
    <Bar orientation="horizontal" {...rest}>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          height: "100%",
          flexDir: "row",
          gap: "token(spacing.2)",
        })}
      >
        <label htmlFor={checkboxName}>
          <Logo
            className={css({
              display: "revert",
              md: {
                display: "none",
              },
              _hover: {
                cursor: "pointer",
              },
            })}
          />
        </label>
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            height: "100%",
            flexDir: "row",
            gap: "token(spacing.1)",
            ps: "token(spacing.3)",
            pe: "token(spacing.3)",
          })}
        >
          <Segments segments={segments} />
        </div>
      </div>
    </Bar>
  );
}
