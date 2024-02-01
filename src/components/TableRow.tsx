"use client";

import { ForwardedRef, PropsWithChildren, forwardRef, useCallback, useState } from "react";

function TableRowInner({
  children,
  onClick,
  unfold,
  forwardedRef,
}: {
  onClick?: () => void,
  unfold?: boolean,
  forwardedRef: ForwardedRef<HTMLTableRowElement | null>,
} & PropsWithChildren) {
  const [unfolded, setUnfolded] = useState(unfold ?? false);

  const handleClick = useCallback(() => {
    setUnfolded(!unfolded);
    (onClick ?? (() => { }))();
  }, [onClick]);

  return (
    <tr ref={forwardedRef} tabIndex={0} onClick={handleClick} className={unfolded ? "unfolded" : undefined}>
      {children}
    </tr>
  );
}

const TableRow = forwardRef<HTMLTableRowElement, Omit<Parameters<typeof TableRowInner>[0], "forwardedRef">>((props, ref) => (
  <TableRowInner {...props} forwardedRef={ref} />
));
export default TableRow;