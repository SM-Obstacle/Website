import { gql } from "@/app/__generated__";
import { Article, LastUpdate, MdLink } from "@/components/Article";
import { ServerProps } from "@/lib/server-props";
import { fetchGraphql } from "@/lib/utils";
import moment from "moment";
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

  const date = moment(content.date).format("DD/MM/YYYY");

  return (
    <Article>
      <div>
        <Markdown
          rehypePlugins={[rehypeRaw]}
          components={{
            "a": MdLink,
          }}
        >{content.content}</Markdown>
      </div>
      <LastUpdate>Date: {date}</LastUpdate>
    </Article>
  );
}