import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { Panel, SubPanel } from "./layout/Panel";
import Link from "./Link";
import { cn } from "@/lib/utils";

/**
 * Markdown renderers shared by the articles and the resources page — the
 * markdown lives in `data/`, so it only needs a small, fixed set of elements.
 * The article's own title is rendered by `ArticlePanel`, so `h1` here is only
 * for the rare in-body one.
 */
export const markdownComponents: Components = {
  h1: (props) => <h1 className="mt-6 mb-2 text-2xl font-black" {...props} />,
  h2: (props) => <h2 className="mt-6 mb-2 text-2xl font-bold" {...props} />,
  h3: (props) => <h3 className="mt-4 mb-2 text-xl font-bold" {...props} />,
  p: (props) => <p className="my-3 leading-relaxed" {...props} />,
  ul: (props) => <ul className="my-3 list-disc ps-6" {...props} />,
  ol: (props) => <ol className="my-3 list-decimal ps-6" {...props} />,
  li: (props) => <li className="my-1" {...props} />,
  hr: (props) => <hr className="my-6 border-border" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-3 border-s-2 border-border ps-4 text-muted-foreground"
      {...props}
    />
  ),
  code: (props) => (
    <code className="rounded-sm bg-black/50 px-1 py-0.5" {...props} />
  ),
  a: ({ ref: _ref, ...props }) => (
    <Link explicit href={props.href ?? "#"} {...props} />
  ),
  img: (props) => (
    // The markdown points at arbitrary hosts, which next/image can't optimise.
    // eslint-disable-next-line @next/next/no-img-element
    <img alt="" {...props} className="max-w-full rounded-md" />
  ),
  iframe: (props) => (
    <iframe {...props} className="aspect-video max-w-full rounded-md" />
  ),
};

/**
 * One article, rendered in full.
 *
 * The panel keeps the viewport's height and the article scrolls inside the
 * sub-panel, so the rounded corners stay visible instead of being sliced off
 * by the scroll edge.
 */
export function ArticlePanel({
  title,
  meta,
  body,
  className,
}: {
  title: string;
  meta?: React.ReactNode;
  body: string;
  className?: string;
}) {
  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-content flex-col">
      <Panel className="flex min-h-0 flex-1 flex-col">
        <SubPanel
          className={cn(
            "scrollbar-slim min-h-0 flex-1 gap-0 overflow-y-auto px-6 py-5",
            className,
          )}
        >
          <header className="mb-4">
            <h1 className="m-0 text-3xl font-black">{title}</h1>

            {meta && (
              <p className="mt-1 mb-0 text-sm text-muted-foreground">{meta}</p>
            )}
          </header>

          <Markdown rehypePlugins={[rehypeRaw]} components={markdownComponents}>
            {body}
          </Markdown>
        </SubPanel>
      </Panel>
    </div>
  );
}
