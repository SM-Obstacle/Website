import { Article, LastUpdate, MdIframe, MdImg, MdLink } from "@/components/Article";
import Date from "@/components/Date";
import { gql } from "../__generated__";
import { fetchGraphql } from "@/lib/utils";
import { redirect } from "next/navigation";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const GET_LAST_ARTICLE_CONTENT = gql(/* GraphQL */ `
  query GetLatestNews {
    latestNews {
      content
      date
    }
  }
`);

export default async function LatestNews() {
  const content = (await fetchGraphql(GET_LAST_ARTICLE_CONTENT)).latestNews;
  // TODO: find a better way to tell that there isn't any last article
  if (!content) return redirect("/");

  return (
    <Article>
      <div>
        <Markdown
          rehypePlugins={[rehypeRaw]}
          components={{
            "iframe": MdIframe,
            "img": MdImg,
            "a": MdLink,
          }}
        >{content.content}</Markdown>
      </div>
      <LastUpdate>Date: <Date onlyDate>{content.date}</Date></LastUpdate>
    </Article>
  );
}