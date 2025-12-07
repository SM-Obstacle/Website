import { css } from "../../@shadow-panda/styled-system/css";
import Bar from "./ui/Bar";

function Segments({ segments }: { segments: React.ReactNode[] }) {
  for (let i = 0; i < segments.length - 1; i++) {
    segments.splice(++i, 0, ">");
  }
  return segments;
}

export default function TitleBar({
  segments,
}: {
  segments: React.ReactNode[];
}) {
  return (
    <Bar orientation="horizontal">
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          height: "100%",
          flexDir: "row",
          gap: 1,
          ps: "token(spacing.3)",
          pe: "token(spacing.3)",
        })}
      >
        <Segments segments={segments} />
      </div>
    </Bar>
  );
}
