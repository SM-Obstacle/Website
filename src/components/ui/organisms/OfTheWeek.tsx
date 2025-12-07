import { MPFormatLink } from "@/components/MPFormat";
import { css } from "../../../../@shadow-panda/styled-system/css";

export default function OfTheWeek({
  path,
  name,
}: {
  path: string;
  name: string;
}) {
  return (
    <div
      className={css({
        width: "100%",
        height: "100%",
        fontSize: "xl",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      })}
    >
      <MPFormatLink path={path}>{name}</MPFormatLink>
    </div>
  );
}
