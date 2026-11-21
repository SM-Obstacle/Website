import { IToken, Style } from "./tokens";
import GenericToken from "./tokens/generic_token";
import LinkTokenClose from "./tokens/link_token_close";
import LinkTokenOpen from "./tokens/link_token_open";

/*
 * Colours are kept exactly as written in the text. Adapting them to the
 * background they end up on is the renderer's job, not the parser's, so the
 * same parse output serves both themes.
 */
export interface ParseOptions {
  disableLinks?: boolean;
  externalLinks?: boolean;
}

/**
 * Names go through here on every render of every row they appear in, and the
 * same handful of them come back each time — so the token list a name parses
 * to is kept rather than rebuilt. Tokens are only ever read afterwards, which
 * is what makes one list shareable between all of a name's occurrences.
 */
const parsed = new Map<string, IToken[]>();

/** Enough to hold a page of names several times over, and bounded all the same. */
const PARSED_KEPT = 512;

export function parse(text: string, options: ParseOptions = {}): IToken[] {
  const key = `${options.disableLinks ? 1 : 0}${
    options.externalLinks ? 1 : 0
  }\u0000${text}`;

  const hit = parsed.get(key);
  if (hit) {
    // Back to the end of the insertion order, so what the page keeps asking
    // for isn't what gets dropped.
    parsed.delete(key);
    parsed.set(key, hit);
    return hit;
  }

  const tokens = parseUncached(text, options);

  if (parsed.size >= PARSED_KEPT) {
    parsed.delete(parsed.keys().next().value!);
  }
  parsed.set(key, tokens);

  return tokens;
}

function parseUncached(text: string, options: ParseOptions): IToken[] {
  let isCode = false;
  let isQuickLink = false;
  let isPrettyLink = false;
  let style = 0;
  const tokens: IToken[] = [];
  const styleStack: number[] = [];
  let nextToken = new GenericToken(null, null);
  let nextLinkToken: LinkTokenOpen | null = null;
  let linkLevel = 0;
  let color: string | null = null;
  let endColor = false;
  let addChar = false;

  function endLink() {
    if (nextToken.text !== "") {
      tokens.push(nextToken);
      nextToken = new GenericToken(style, null);
      tokens.push(new LinkTokenClose());
    } else if (tokens[tokens.length - 1] === nextLinkToken) {
      tokens.pop();
    } else {
      tokens.push(new LinkTokenClose());
    }

    nextLinkToken = null;
    isQuickLink = false;
    isPrettyLink = false;
  }

  function endText(force: boolean = false) {
    if (force || style !== nextToken.style) {
      if (nextToken.text !== "") {
        tokens.push(nextToken);
        nextToken = new GenericToken(style, null);
      } else {
        nextToken.style = style;
      }
    }
  }

  const ref = text.split("");

  let j = 0;
  for (let index = j, len = ref.length; j < len; index = ++j) {
    const c = ref[index];
    if (isCode) {
      const tok = c.toLowerCase();
      switch (tok) {
        case "i": {
          style = style ^ Style.ITALIC;
          break;
        }
        case "o": {
          style = style ^ Style.BOLD;
          break;
        }
        case "s": {
          style = style ^ Style.SHADOWED;
          break;
        }
        case "w": {
          style = style | Style.WIDE;
          style = style & ~Style.NARROW;
          break;
        }
        case "n": {
          style = style | Style.NARROW;
          style = style & ~Style.WIDE;
          break;
        }
        case "l":
        case "h":
        case "p": {
          if (nextLinkToken !== null) {
            endLink();
          } else {
            endText(true);
            nextLinkToken = new LinkTokenOpen(
              tok === "h",
              null,
              options.externalLinks,
            );
            if (!options.disableLinks) {
              tokens.push(nextLinkToken);
            }
            isQuickLink = true;
            isPrettyLink = true;
            linkLevel = styleStack.length;
          }
          break;
        }
        case "z": {
          style =
            styleStack.length === 0
              ? styleStack.length
              : styleStack[styleStack.length - 1];
          if (nextLinkToken) {
            endLink();
          }
          break;
        }
        case "m": {
          style = style & ~(Style.NARROW | Style.WIDE);
          break;
        }
        case "g": {
          style =
            style &
            (styleStack.length === 0
              ? ~0x1fff
              : styleStack[styleStack.length - 1] | ~0x1fff);
          break;
        }
        case "<": {
          styleStack.push(style);
          break;
        }
        case "<": {
          if (styleStack.length !== 0) {
            style = styleStack.pop()!;
            if (nextLinkToken && linkLevel > styleStack.length) {
              endLink();
            }
          }
          break;
        }
        case "$": {
          nextToken.text += "$";
          break;
        }
        default: {
          if (/[a-f0-9]/i.test(c)) {
            color = c;
          }
        }
      }
      endText();
      isCode = false;
    } else if (c === "$") {
      isCode = true;
      if (isQuickLink && isPrettyLink) {
        isPrettyLink = false;
      }
    } else if (color) {
      endColor = false;
      addChar = false;

      if (/[a-f0-9]/i.test(c)) {
        color += c.replace(/[^a-f0-9]/gi, "0");
        endColor = color.length === 3;
      } else {
        for (let i = 0, len = 3 - color.length; i < len; i += 1) {
          color += "0";
        }
        endColor = true;
        addChar = true;
      }

      if (endColor) {
        style = style & ~0xfff;
        style = style | Style.COLORED | (parseInt(color, 16) & 0xfff);
        endText();
        color = null;
        if (addChar) {
          nextToken.text += c;
        }
      }
    } else if (isQuickLink && isPrettyLink) {
      if (c === "[") {
        isQuickLink = false;
      } else {
        isPrettyLink = false;
        nextToken.text += c;
        if (nextLinkToken) {
          nextLinkToken.link += c;
        }
      }
    } else if (isPrettyLink) {
      if (c === "]") {
        isPrettyLink = false;
      } else if (nextLinkToken) {
        nextLinkToken.link += c;
      }
    } else {
      nextToken.text += c;
      if (isQuickLink && nextLinkToken) {
        nextLinkToken.link += c;
      }
    }
  }

  if (nextToken.text !== "") {
    tokens.push(nextToken);
  }
  if (nextLinkToken && !options.disableLinks) {
    tokens.push(new LinkTokenClose());
  }

  return tokens;
}

export function toHTML(tokens: IToken[]): string {
  return tokens.map((tok) => tok.toHTML()).join("");
}

export function toPlainText(tokens: IToken[]): string {
  return tokens.map((tok) => tok.toPlainText()).join("");
}
