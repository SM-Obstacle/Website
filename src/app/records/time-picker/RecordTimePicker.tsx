"use client";

import { Input } from "@/components/ui/molecules/Input";
import { ChangeEventHandler, useRef } from "react";
import { css } from "../../../../@shadow-panda/styled-system/css";

export default function RecordTimePicker({ name }: { name: string }) {
  const ref = useRef<HTMLInputElement>(null);

  const onHourChange: ChangeEventHandler<HTMLInputElement> = (e) => {};
  const onMinuteChange: ChangeEventHandler<HTMLInputElement> = (e) => {};
  const onSecondChange: ChangeEventHandler<HTMLInputElement> = (e) => {};

  return (
    <div>
      <input type="hidden" ref={ref} />

      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "token(spacing.1)",
        })}
      >
        <Input
          type="number"
          min="0"
          placeholder="00"
          onChange={onHourChange}
          roundedStart="full"
          roundedEnd="token(radii.md)"
        />
        <span>h</span>
        <Input
          type="number"
          min="0"
          max="59"
          placeholder="00"
          onChange={onMinuteChange}
        />
        <span>m</span>
        <Input
          type="number"
          min="0"
          max="59"
          placeholder="00"
          onChange={onSecondChange}
          roundedStart="token(radii.md)"
          roundedEnd="full"
        />
        <span>s</span>
      </div>
    </div>
  );
}
