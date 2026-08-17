import type { Metadata } from "next";

import { ArticlePanel } from "@/components/Article";
import FormattedDate from "@/components/FormattedDate";
import PageShell from "@/components/layout/PageShell";
import { Panel } from "@/components/layout/Panel";
import PageTitle from "@/components/layout/PageTitle";
import { fetchArticleFeed, fetchArticles } from "@/lib/article";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Latest news",
};

export default async function LatestNews() {
  const [newest] = await fetchArticleFeed();
  const article = newest && (await fetchArticles())[newest.slug];

  if (!article) {
    return (
      <PageShell
        titleSegments={[<PageTitle key="title">Latest news</PageTitle>]}
        selectedMenu="articles"
      >
        <Panel className="m-auto p-8 text-muted-foreground">
          No article has been published yet.
        </Panel>
      </PageShell>
    );
  }

  const { title, body } = await article.fetchDocument();

  return (
    <PageShell
      titleSegments={[<PageTitle key="title">Latest news</PageTitle>]}
      selectedMenu="articles"
    >
      <ArticlePanel
        title={title}
        body={body}
        meta={
          <>
            <FormattedDate onlyDate>{article.date}</FormattedDate>
            {article.authors.length > 0 && (
              <> — by {article.authors.join(", ")}</>
            )}
          </>
        }
      />
    </PageShell>
  );
}
