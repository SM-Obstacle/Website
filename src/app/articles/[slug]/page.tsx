import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { ArticleBody, markdownComponents } from "@/components/Article";
import FormattedDate from "@/components/FormattedDate";
import PageShell from "@/components/layout/PageShell";
import { Panel } from "@/components/layout/Panel";
import PageTitle from "@/components/layout/PageTitle";
import { fetchArticles } from "@/lib/article";

/** The article title is the first markdown heading, so read it from the file. */
async function articleTitle(slug: string) {
  const article = (await fetchArticles())[slug];
  if (!article) return undefined;

  const heading = (await article.fetchContent()).match(/^#\s+(.+)$/m);
  return heading?.[1].trim();
}

export async function generateMetadata(
  props: PageProps<"/articles/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  return { title: (await articleTitle(slug)) ?? slug };
}

export default async function ArticlePage(props: PageProps<"/articles/[slug]">) {
  const { slug } = await props.params;

  const articles = await fetchArticles();
  const article = articles[slug];

  if (!article || article.hide || slug === "__resources__") {
    notFound();
  }

  const content = await article.fetchContent();

  return (
    <PageShell
      titleSegments={[<PageTitle key="title">Article</PageTitle>]}
      selectedMenu="resources"
    >
      <div className="scrollbar-slim mx-auto h-full w-full max-w-content overflow-y-auto">
        <Panel className="p-5">
          <ArticleBody
            lastUpdate={
              <>
                Date: <FormattedDate onlyDate>{article.date}</FormattedDate>
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
        </Panel>
      </div>
    </PageShell>
  );
}
