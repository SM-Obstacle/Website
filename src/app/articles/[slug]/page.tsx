import { gql } from "@/app/__generated__";
import { Article, LastUpdate, MdIframe, MdImg, MdLink } from "@/components/Article";
import { ServerProps } from "@/lib/server-props";
import { fetchGraphql } from "@/lib/utils";
import Date from "@/components/Date";
import { redirect } from "next/navigation";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const GET_ARTICLE = gql(/* GraphQL */ `
  query GetArticle($slug: String!) {
    article(slug: $slug) {
      content
      date
    }
  }
`);

export default async function ArticlePage(sp: ServerProps<{ slug: string }>) {
  const content = (await fetchGraphql(GET_ARTICLE, {
    slug: sp.params.slug,
  })).article;

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