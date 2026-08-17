import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticlePanel } from "@/components/Article";
import FormattedDate from "@/components/FormattedDate";
import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";
import { fetchArticles, RESOURCES_SLUG } from "@/lib/article";

export const revalidate = 300;

/** The resources page isn't a dated post; it lives under /links/resources. */
async function findArticle(slug: string) {
  const article = (await fetchArticles())[slug];
  return article && !article.hide && article.slug !== RESOURCES_SLUG
    ? article
    : undefined;
}

export async function generateMetadata(
  props: PageProps<"/articles/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await findArticle(slug);

  return { title: article ? await article.fetchTitle() : slug };
}

export default async function ArticlePage(props: PageProps<"/articles/[slug]">) {
  const { slug } = await props.params;
  const article = await findArticle(slug);

  if (!article) {
    notFound();
  }

  const { title, body } = await article.fetchDocument();

  return (
    <PageShell
      titleSegments={[
        <PageTitle key="title">Articles</PageTitle>,
        <PageTitle key="article">{title}</PageTitle>,
      ]}
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
