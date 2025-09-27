import { rgb12to24 } from "@/lib/mpformat/color";
import { parse, toPlainText } from "@/lib/mpformat/mpformat";
import { type IToken, Style } from "@/lib/mpformat/tokens";
import GenericToken from "@/lib/mpformat/tokens/generic_token";
import LinkTokenClose from "@/lib/mpformat/tokens/link_token_close";
import LinkTokenOpen from "@/lib/mpformat/tokens/link_token_open";
import css from "../styles/mpformat.module.css";
import Link, { type LinkProps } from "./Link";

function MPFormatGenericToken({ token }: { token: GenericToken }) {
  return token.style ? (
    <span
      style={{
        ...(token.style & Style.COLORED && {
          color: (() => {
            let color = rgb12to24(token.style & 0xfff).toString(16);
            if (color.length === 1) {
              color = `00000${color}`;
            } else if (color.length === 2) {
              color = `0000${color}`;
            } else if (color.length === 4) {
              color = `00${color}`;
            }
            return `#${color}`;
          })(),
        }),
        ...(token.style & Style.ITALIC && { fontStyle: "italic" }),
        ...(token.style & Style.BOLD && { fontWeight: "bold" }),
        ...(token.style & Style.SHADOWED && {
          textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)",
        }),
        ...(token.style & Style.WIDE && { fontSize: "105%" }),
        ...(token.style & Style.NARROW && { fontSize: "95%" }),
      }}
    >
      {token.text}
    </span>
  ) : (
    token.text
  );
}

function MPFormatLinkToken({
  token,
  tokens,
}: {
  token: LinkTokenOpen;
  tokens: IToken[];
}) {
  const i = tokens.findIndex((token) => token instanceof LinkTokenClose);
  const enclosed = tokens.slice(0, i);
  const rest = tokens.slice(i + 1);
  return (
    <>
      <a
        href={
          token.manialink && !/^maniaplanet:/i.test(token.link)
            ? `maniaplanet://#manialink=${token.link}`
            : !token.manialink && !/^http:/i.test(token.link)
              ? `http://${token.link}`
              : token.link
        }
        {...(token.external &&
          !token.manialink && {
            target: "_blank",
            rel: "noopener noreferrer",
          })}
      >
        <MPFormatInner tokens={enclosed} />
      </a>
      <MPFormatInner tokens={rest} />
    </>
  );
}

function MPFormatInner({ tokens }: { tokens: IToken[] }) {
  const firstToken = tokens[0];

  return firstToken instanceof GenericToken ? (
    <>
      <MPFormatGenericToken token={firstToken} />
      <MPFormatInner tokens={tokens.slice(1)} />
    </>
  ) : firstToken instanceof LinkTokenOpen ? (
    <MPFormatLinkToken token={firstToken} tokens={tokens.slice(1)} />
  ) : null;
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
  name,
  component = Link,
}: {
  path: string;
  name: string;
  component?: React.ElementType<LinkProps>;
}) {
  const Component = component;
  return (
    <Component
      title={toPlainText(parse(name))}
      href={path}
      className={css.mpstring}
    >
      <MPFormat disableLinks>{name}</MPFormat>
    </Component>
  );
}
