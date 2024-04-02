import { parse, toHTML, toPlainText } from "@/lib/mpformat/mpformat";
import Link, { LinkProps } from "./Link";
import css from "../styles/mpformat.module.css";

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
  component = Link,
}: {
  path: string,
  name: string,
  component?: React.ElementType<LinkProps>,
}) {
  const Component = component;
  return (
    <Component
      title={toPlainText(parse(name))}
      href={path}
      className={css.mpstring}
    >
      <MPFormat>{name}</MPFormat>
    </Component>
  );
}