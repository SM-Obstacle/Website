"use client";

import { Input } from "@/components/ui/molecules/Input";
import { ChangeEventHandler, useRef } from "react";
import { css } from "../../../../@shadow-panda/styled-system/css";

export default function RecordTimePicker({ name }: { name: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  const calculateTotalMilliseconds = () => {
    const hours = parseInt(hourRef.current?.value || "0", 10);
    const minutes = parseInt(minuteRef.current?.value || "0", 10);
    const seconds = parseInt(secondRef.current?.value || "0", 10);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  };

  const updateHiddenInput = () => {
    if (ref.current) {
      ref.current.value = calculateTotalMilliseconds().toString();
    }
  };

  const normalizeTime = () => {
    let hours = parseInt(hourRef.current?.value || "0", 10);
    let minutes = parseInt(minuteRef.current?.value || "0", 10);
    let seconds = parseInt(secondRef.current?.value || "0", 10);

    if (seconds >= 60) {
      minutes += Math.floor(seconds / 60);
      seconds = seconds % 60;
    }

    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }

    if (hourRef.current) hourRef.current.value = hours.toString();
    if (minuteRef.current) minuteRef.current.value = minutes.toString();
    if (secondRef.current) secondRef.current.value = seconds.toString();

    updateHiddenInput();
  };

  const onHourChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    updateHiddenInput();
  };
  const onMinuteChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value.length >= 2) {
      secondRef.current?.focus();
    }
    normalizeTime();
  };
  const onSecondChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    normalizeTime();
  };

  return (
    <div>
      <input type="hidden" ref={ref} name={name} />

      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "token(spacing.1)",
        })}
      >
        <Input
          ref={hourRef}
          type="number"
          min="0"
          placeholder="00"
          onChange={onHourChange}
          roundedStart="full"
          roundedEnd="token(radii.md)"
        />
        <span>h</span>
        <Input
          ref={minuteRef}
          type="number"
          min="0"
          max="59"
          placeholder="00"
          onChange={onMinuteChange}
        />
        <span>m</span>
        <Input
          ref={secondRef}
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
