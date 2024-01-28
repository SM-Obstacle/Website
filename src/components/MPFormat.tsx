import { toHTML, parse, toPlainText } from "@altrd/mpformat";
import Link from "next/link";

export default function MPFormat({
  children,
}: { children: string }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: toHTML(parse(children ?? "", { disableLinks: true })),
      }}
    ></span>
  );
}

export function MPFormatLink({
  path,
  name,
}: {
  path: string,
  name: string,
}) {
  return (
    <Link
      title={toPlainText(parse(name))}
      href={path}
      className="mpstring"
    >
      <MPFormat>{name}</MPFormat>
    </Link>
  );
}