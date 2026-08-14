import type { Components } from "react-markdown";

import Link from "./Link";

/**
 * Markdown renderers shared by the articles and the resources page — the
 * markdown lives in `data/`, so it only needs a small, fixed set of elements.
 */
export const markdownComponents: Components = {
  h1: (props) => <h1 className="mt-0 mb-2 text-3xl font-black" {...props} />,
  h2: (props) => <h2 className="mt-6 mb-2 text-2xl font-bold" {...props} />,
  h3: (props) => <h3 className="mt-4 mb-2 text-xl font-bold" {...props} />,
  p: (props) => <p className="my-3 leading-relaxed" {...props} />,
  ul: (props) => <ul className="my-3 list-disc ps-6" {...props} />,
  ol: (props) => <ol className="my-3 list-decimal ps-6" {...props} />,
  li: (props) => <li className="my-1" {...props} />,
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

export function ArticleBody({
  lastUpdate,
  children,
}: React.PropsWithChildren<{ lastUpdate?: React.ReactNode }>) {
  return (
    <div className="flex flex-col items-start justify-between gap-2 md:flex-row">
      <div className="min-w-0 flex-1">{children}</div>

      {lastUpdate && (
        <span className="sticky top-0 shrink-0 text-sm text-muted-foreground">
          {lastUpdate}
        </span>
      )}
    </div>
  );
}
