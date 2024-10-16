"use client";

import moment from "moment";
import { useEffect, useState } from "react";

function formatDateImpl(date: string, f: string) {
  return moment.utc(date).local().format(f)
}

export function formatDate(date: string) {
  return formatDateImpl(date, "DD/MM/YYYY");
}

export function formatDateTime(date: string) {
  return formatDateImpl(date, "HH:mm:ss")
}

export const formatFull = (date: string) => formatDate(date) + " " + formatDateTime(date);

export default function Date({ children, onlyDate }: { children: string; onlyDate?: boolean }) {
  const [localDate, setLocalDate] = useState({
    full: "",
    small: "",
  });

  useEffect(() => {
    const d = moment.utc(children).local();
    setLocalDate({
      full: d.format("DD/MM/YYYY HH:mm:ss"),
      small: d.format(onlyDate ? "DD/MM/YYYY" : "HH:mm:ss"),
    });
  }, [children, onlyDate]);

  return (
    <span title={localDate.full}>{localDate.small}</span>
  );
}