import {
  Article,
  LastUpdate,
  MdIframe,
  MdImg,
  MdLink,
} from "@/components/Article";
import { ServerProps } from "@/lib/server-props";
import FormattedDate from "@/components/FormattedDate";
import { redirect } from "next/navigation";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { fetchArticles } from "@/lib/article";

export default async function ArticlePage(sp: ServerProps<{ slug: string }>) {
  const params = await sp.params;
  if (params.slug === "__resources__") {
    return redirect("/");
  }

  const articles = await fetchArticles();
  const article = articles[params.slug];
  // TODO: find a better way to tell that there isn't any article
  if (!article || article.hide) {
    return redirect("/");
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
