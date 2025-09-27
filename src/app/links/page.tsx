import type { Metadata } from "next";
import Markdown from "react-markdown";
import { Article, LastUpdate, MdLink } from "@/components/Article";
import FormattedDate from "@/components/FormattedDate";
import { fetchArticles } from "@/lib/article";

export const metadata: Metadata = {
  title: "RESOURCES",
};

export default async function Links() {
  const articles = await fetchArticles();
  const resourcesArticle = articles.__resources__;
  const content = await resourcesArticle.fetchContent();

  return (
    <Article>
      <div>
        <Markdown
          components={{
            a: MdLink,
          }}
        >
          {content}
        </Markdown>
      </div>
      <LastUpdate>
        Last update:{" "}
        <FormattedDate onlyDate>{resourcesArticle.date}</FormattedDate>
      </LastUpdate>
    </Article>
  );
}
