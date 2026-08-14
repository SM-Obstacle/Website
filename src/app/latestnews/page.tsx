import type { Metadata } from "next";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { ArticleBody, markdownComponents } from "@/components/Article";
import FormattedDate from "@/components/FormattedDate";
import PageShell from "@/components/layout/PageShell";
import { Panel } from "@/components/layout/Panel";
import PageTitle from "@/components/layout/PageTitle";
import { type Article, fetchArticles } from "@/lib/article";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Latest news",
};

export default async function LatestNews() {
  const articles = await fetchArticles();
  const lastArticle = Object.entries(articles)
    .filter(([slug]) => slug !== "__resources__")
    .map(([, article]) => article)
    .reduce<Article | null>(
      (latest, current) =>
        latest === null || current.date > latest.date ? current : latest,
      null,
    );

  const content = await lastArticle?.fetchContent();

  return (
    <PageShell
      titleSegments={[<PageTitle key="title">Latest news</PageTitle>]}
      selectedMenu="resources"
    >
      <div className="scrollbar-slim mx-auto h-full w-full max-w-content overflow-y-auto">
        <Panel className="p-5">
          {lastArticle && content ? (
            <ArticleBody
              lastUpdate={
                <>
                  Date:{" "}
                  <FormattedDate onlyDate>{lastArticle.date}</FormattedDate>
                </>
              }
            >
              <Markdown
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
              >
                {content}
              </Markdown>
            </ArticleBody>
          ) : (
            <p className="text-muted-foreground">No article found.</p>
          )}
        </Panel>
      </div>
    </PageShell>
  );
}
