import { invertLight, nudgeDark, rgb12toHex } from "@/lib/mpformat/color";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import { type IToken, Style } from "@/lib/mpformat/tokens";
import GenericToken from "@/lib/mpformat/tokens/generic_token";
import LinkTokenClose from "@/lib/mpformat/tokens/link_token_close";
import LinkTokenOpen from "@/lib/mpformat/tokens/link_token_open";
import { cn } from "@/lib/utils";
import styles from "@/styles/mpformat.module.css";
import Link, { type LinkProps } from "./Link";

/*
 * The colour a token asks for is emitted twice, darkened for a light
 * background and brightened for a dark one, and `.themed` picks the one the
 * current theme calls for. Nothing here depends on the resolved theme, which
 * is what keeps the component renderable on the server.
 */
function coloredStyle(style: number) {
  const rgb = (style & 0xfff).toString(16).padStart(3, "0");
  return {
    "--mp-light": rgb12toHex(invertLight(rgb)),
    "--mp-dark": rgb12toHex(nudgeDark(rgb)),
  };
}

function MPFormatGenericToken({ token }: { token: GenericToken }) {
  const colored = (token.style & Style.COLORED) !== 0;

  return token.style ? (
    <span
      className={cn(colored && styles.themed)}
      style={
        {
          ...(colored && coloredStyle(token.style)),
          ...(token.style & Style.ITALIC && { fontStyle: "italic" }),
          ...(token.style & Style.BOLD && { fontWeight: "bold" }),
          ...(token.style & Style.SHADOWED && {
            textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
          }),
          ...(token.style & Style.WIDE && { fontSize: "105%" }),
          ...(token.style & Style.NARROW && { fontSize: "95%" }),
        } as React.CSSProperties
      }
    >
      {token.text}
    </span>
  ) : (
    token.text
  );
}

function linkHref(token: LinkTokenOpen) {
  return token.manialink && !/^maniaplanet:/i.test(token.link)
    ? `maniaplanet://#manialink=${token.link}`
    : !token.manialink && !/^http:/i.test(token.link)
      ? `http://${token.link}`
      : token.link;
}

/**
 * The tokens of one name, walked in a loop rather than recursively: a name
 * carries one token per style change, and a component per token per remaining
 * token is a tree deep enough to show on a page listing fifty of them.
 *
 * Anything but the two tokens that make up a name ends the walk, the way the
 * recursion used to bottom out on them.
 */
function MPFormatInner({ tokens }: { tokens: IToken[] }) {
  const rendered: React.ReactNode[] = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];

    if (token instanceof GenericToken) {
      rendered.push(<MPFormatGenericToken key={i} token={token} />);
      continue;
    }

    if (!(token instanceof LinkTokenOpen)) break;

    // A link runs to its closing token, or to the end of the name when the
    // text never closed it.
    let close = i + 1;
    while (
      close < tokens.length &&
      !(tokens[close] instanceof LinkTokenClose)
    ) {
      close += 1;
    }

    rendered.push(
      <a
        key={i}
        href={linkHref(token)}
        {...(token.external &&
          !token.manialink && {
            target: "_blank",
            rel: "noopener noreferrer",
          })}
      >
        <MPFormatInner tokens={tokens.slice(i + 1, close)} />
      </a>,
    );

    i = close;
  }

  return rendered;
}

export default function MPFormat({
  children,
  disableLinks = true,
}: {
  children: string;
  disableLinks?: boolean;
}) {
  const parsed = parse(children, { disableLinks });
  return (
    <span>
      <MPFormatInner tokens={parsed} />
    </span>
  );
}

export function MPFormatLink({
  path,
  component: Component = Link,
  children,
  className,
  ...rest
}: {
  path: string;
  component?: React.ElementType<LinkProps>;
  children: string;
} & Omit<LinkProps, "href">) {
  return (
    <Component
      title={toPlainText(parse(children))}
      href={path}
      className={cn("no-underline hover:underline", className)}
      {...rest}
    >
      <MPFormat disableLinks>{children}</MPFormat>
    </Component>
  );
}
