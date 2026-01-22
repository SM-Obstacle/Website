import { MPFormatLink } from "@/components/MPFormat";
import { css } from "../../../../@shadow-panda/styled-system/css";

export default function OfTheWeek({
  path,
  name,
  icon,
}: {
  path: string;
  name: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={css({
        width: "100%",
        height: "100%",
        fontSize: "4xl",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: "token(spacing.2)",
        padding: "token(spacing.6)",
      })}
    >
      {icon}
      <MPFormatLink path={path}>{name}</MPFormatLink>
    </div>
  );
}
