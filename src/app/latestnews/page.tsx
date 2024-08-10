import { Article, LastUpdate, MdImg, MdLink } from "@/components/Article";
import Link from "@/components/Link";
import { gql } from "../__generated__";
import { fetchGraphql } from "@/lib/utils";
import moment from "moment";
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
  const date = moment(content.date).format("DD/MM/YYYY");

  return (
    <Article>
      <div>
        <Markdown
          rehypePlugins={[rehypeRaw]}
          components={{
            "img": MdImg,
            "a": MdLink,
          }}
        >{content.content}</Markdown>
      </div>
      <LastUpdate>Date: {date}</LastUpdate>
    </Article>
  );
}