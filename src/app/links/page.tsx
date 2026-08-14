import type { Metadata } from "next";
import Markdown from "react-markdown";

import { ArticleBody, markdownComponents } from "@/components/Article";
import FormattedDate from "@/components/FormattedDate";
import PageShell from "@/components/layout/PageShell";
import { Panel } from "@/components/layout/Panel";
import PageTitle from "@/components/layout/PageTitle";
import { fetchArticles } from "@/lib/article";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Resources",
};

export default async function Links() {
  const articles = await fetchArticles();
  const resourcesArticle = articles.__resources__;
  const content = await resourcesArticle.fetchContent();

  return (
    <PageShell
      titleSegments={[<PageTitle key="title">Resources</PageTitle>]}
      selectedMenu="resources"
    >
      <div className="scrollbar-slim mx-auto h-full w-full max-w-content overflow-y-auto">
        <Panel className="p-5">
          <ArticleBody
            lastUpdate={
              <>
                Last update:{" "}
                <FormattedDate onlyDate>{resourcesArticle.date}</FormattedDate>
              </>
            }
          >
            <Markdown components={markdownComponents}>{content}</Markdown>
          </ArticleBody>
        </Panel>
      </div>
    </PageShell>
  );
}
