import type { Metadata } from "next";
import Markdown from "react-markdown";
import { Article, LastUpdate, MdH1, MdH2, MdLink } from "@/components/Article";
import FormattedDate from "@/components/FormattedDate";
import PageBase from "@/components/PageBase";
import Block from "@/components/ui/Block";
import { H1, H2 } from "@/components/ui/typography";
import { fetchArticles } from "@/lib/article";
import { css } from "../../../@shadow-panda/styled-system/css";

export const metadata: Metadata = {
  title: "RESOURCES",
};

export default async function Links() {
  const articles = await fetchArticles();
  const resourcesArticle = articles.__resources__;
  const content = await resourcesArticle.fetchContent();

  return (
    <PageBase
      titleSegments={[<H1 key="title">Resources</H1>]}
      selectedMenu="resources"
    >
      <div
        className={css({
          height: "100%",
          flexGrow: 1,
          maxWidth: "token(sizes.maxContentWidth)",
          margin: "auto",
        })}
      >
        <Block
          className={css({
            height: "calc(100% - token(spacing.2) * 2)",
            overflowY: "auto",
          })}
        >
          <Article>
            <div
              className={css({
                height: 0,
              })}
            >
              <Markdown
                components={{
                  h1: MdH1,
                  h2: MdH2,
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
        </Block>
      </div>
    </PageBase>
  );
}
