"use client";

import { PropsWithChildren, useCallback, useState } from "react";

export default function TableRow({
  children,
  onClick,
  unfold,
}: {
  onClick?: () => void,
  unfold?: boolean,
} & PropsWithChildren) {
  const [unfolded, setUnfolded] = useState(unfold ?? false);

  const handleClick = useCallback(() => {
    setUnfolded(!unfolded);
    (onClick ?? (() => { }))();
  }, [onClick]);

  return (
    <tr tabIndex={0} onClick={handleClick} className={unfolded ? "unfolded" : undefined}>
      {children}
    </tr>
  );
}