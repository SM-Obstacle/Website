import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  Article,
  LastUpdate,
  MdIframe,
  MdImg,
  MdLink,
} from "@/components/Article";
import FormattedDate from "@/components/FormattedDate";
import { fetchArticles } from "@/lib/article";
import type { ServerProps } from "@/lib/server-props";

export default async function ArticlePage(sp: ServerProps<{ slug: string }>) {
  const params = await sp.params;
  const articles = await fetchArticles();
  const article = articles[params.slug];
  if (!article || article.hide || params.slug === "__resources__") {
    return "Article not found.";
  }

  const content = await article.fetchContent();

  return (
    <Article>
      <div>
        <Markdown
          rehypePlugins={[rehypeRaw]}
          components={{
            iframe: MdIframe,
            img: MdImg,
            a: MdLink,
          }}
        >
          {content}
        </Markdown>
      </div>
      <LastUpdate>
        Date: <FormattedDate onlyDate>{article.date}</FormattedDate>
      </LastUpdate>
    </Article>
  );
}
