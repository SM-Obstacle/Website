import { MPFormatLink } from "@/components/MPFormat";
import { ToolBarWrapper, ToolbarSpan, ToolbarTitle } from "@/components/ToolbarWrapper";
import { css } from "../../../../styled-system/css";
import { PropsWithChildren } from "react";

function PlayerZone({
  children,
}: {
  children: string | null | undefined,
}) {
  if (!children) return null;
  const [world, continent, country] = children.split('|').slice(0, 3);

  const styles = css({
    "@media only screen and (max-width: 870px)": {
      display: "none",
    }
  });

  return (
    <ToolbarSpan>
      <span className={styles}>{world}/{continent}/</span>
      <span>{country}</span>
    </ToolbarSpan>
  );
}

export default function PlayerToolbar({
  role,
  zonePath,
  children,
}: {
  role: string,
  zonePath: string | null | undefined,
} & PropsWithChildren) {
  const playerRole = role[0] + role.slice(1).toLowerCase();

  return (
    <ToolBarWrapper>
      <ToolbarTitle>
        {children}
      </ToolbarTitle>
      <PlayerZone>{zonePath}</PlayerZone>
      <ToolbarSpan>{playerRole}</ToolbarSpan>
    </ToolBarWrapper>
  );
}