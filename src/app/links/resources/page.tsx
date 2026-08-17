import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticlePanel } from "@/components/Article";
import FormattedDate from "@/components/FormattedDate";
import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";
import { fetchArticles, RESOURCES_SLUG } from "@/lib/article";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Resources",
};

export default async function ResourcesPage() {
  const article = (await fetchArticles())[RESOURCES_SLUG];

  if (!article) {
    notFound();
  }

  const { title, body } = await article.fetchDocument();

  return (
    <PageShell
      titleSegments={[
        <PageTitle key="title">Articles</PageTitle>,
        <PageTitle key="resources">{title}</PageTitle>,
      ]}
      selectedMenu="articles"
    >
      <ArticlePanel
        title={title}
        body={body}
        meta={
          <>
            Last update: <FormattedDate onlyDate>{article.date}</FormattedDate>
          </>
        }
      />
    </PageShell>
  );
}
