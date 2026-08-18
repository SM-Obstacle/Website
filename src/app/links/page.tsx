import { BookOpen, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

import FormattedDate from "@/components/FormattedDate";
import PageShell from "@/components/layout/PageShell";
import { Panel, SubPanel } from "@/components/layout/Panel";
import PageTitle from "@/components/layout/PageTitle";
import Link from "@/components/Link";
import { fetchArticleFeed } from "@/lib/article";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Articles",
};

export default async function ArticlesIndex() {
  const articles = await fetchArticleFeed();

  return (
    <PageShell
      titleSegments={[<PageTitle key="title">Blog</PageTitle>]}
      selectedMenu="articles"
    >
      <div className="mx-auto h-full w-full max-w-content">
        {/* The panel keeps the viewport's height and the articles scroll inside
            it, so the frame stays put instead of riding up with the list.
            Rounded like a sub-panel so what scrolls is clipped along the same
            curve as the panel around it. */}
        <Panel className="h-full min-h-0 gap-inset overflow-hidden">
          <div className="scrollbar-slim flex min-h-0 flex-1 flex-col gap-inset overflow-y-auto rounded-panel">
            <Link href="/links/resources" className="group">
              <SubPanel className="flex-row items-center gap-4 p-5 transition-colors hover:bg-accent">
                <BookOpen className="size-8 shrink-0" aria-hidden />

                <div className="min-w-0 flex-1">
                  <h2 className="m-0 text-xl font-bold">Resources</h2>
                  <p className="m-0 text-sm text-muted-foreground">
                    Wiki, Discord, map hosting, and everything included in the
                    titlepack.
                  </p>
                </div>

                <ChevronRight
                  className="size-5 shrink-0 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </SubPanel>
            </Link>

            {articles.length === 0 ? (
              <SubPanel className="p-5 text-muted-foreground">
                No article has been published yet.
              </SubPanel>
            ) : (
              <ul className="flex flex-col gap-inset">
                {articles.map((article) => (
                  <li key={article.slug}>
                    <Link href={`/articles/${article.slug}`} className="group">
                      <SubPanel className="gap-1 p-5 transition-colors hover:bg-accent">
                        <div className="flex items-center gap-2">
                          <h2 className="m-0 min-w-0 flex-1 truncate text-xl font-bold">
                            {article.title}
                          </h2>
                          <ChevronRight
                            className="size-5 shrink-0 transition-transform group-hover:translate-x-1"
                            aria-hidden
                          />
                        </div>

                        <p className="m-0 text-sm text-muted-foreground">
                          <FormattedDate onlyDate>{article.date}</FormattedDate>
                          {article.authors.length > 0 &&
                            ` — by ${article.authors.join(", ")}`}
                        </p>
                      </SubPanel>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
