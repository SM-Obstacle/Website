/**
 * A record reports the conditions it was set under as a single integer, two
 * bits per flag: `0b01` is the flag on, and `0b00` a record that says nothing
 * about it — which is why each one has a third state to show rather than a
 * default to fall back on. Both of the pairs left over read as off: the API
 * sends `0b10` (a clean run comes back as 682, five of them in a row), and
 * `0b11` is the same answer from a record that fills its unset bits in.
 */

export type FlagState = "on" | "off" | "unknown";

const PAIR = 0b11;
const ON = 0b01;
const UNSET = 0b00;
const FILLED = 0b11;

export type RecordFlag = {
  label: string;
  /** Position of the low bit of this flag's pair inside the integer. */
  bit: number;
  /** The alt glitch pair has no "off": `0b11` there reads as undetermined. */
  offIsUnknown?: boolean;
};

export const RECORD_FLAGS: readonly RecordFlag[] = [
  { label: "RS bug", bit: 0 },
  { label: "Alt glitch", bit: 2, offIsUnknown: true },
  { label: "PvP Weapons", bit: 4 },
  { label: "PvP Collisions", bit: 6 },
  { label: "SH", bit: 8 },
];

export function readRecordFlag(flags: number, flag: RecordFlag): FlagState {
  const pair = (flags >> flag.bit) & PAIR;

  if (pair === ON) return "on";
  if (pair === UNSET) return "unknown";
  if (pair === FILLED && flag.offIsUnknown) return "unknown";
  return "off";
}
