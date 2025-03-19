import { Article, LastUpdate, MdIframe, MdImg, MdLink } from "@/components/Article";
import { ServerProps } from "@/lib/server-props";
import Date from "@/components/Date";
import { redirect } from "next/navigation";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { fetchArticles } from "@/lib/article";

export default async function ArticlePage(sp: ServerProps<{ slug: string }>) {
  const articles = await fetchArticles();
  const article = articles[(await sp.params).slug];
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
            "iframe": MdIframe,
            "img": MdImg,
            "a": MdLink,
          }}
        >{content}</Markdown>
      </div>
      <LastUpdate>Date: <Date onlyDate>{article.date}</Date></LastUpdate>
    </Article>
  );
}