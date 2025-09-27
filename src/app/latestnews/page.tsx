import { redirect } from "next/navigation";
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

export default async function LatestNews() {
  const articles = await fetchArticles();
  const lastArticle = Object.values(articles).reduce((previous, current) => {
    if (current.date > previous.date) {
      return current;
    }
    return previous;
  });
  // TODO: find a better way to tell that there isn't any last article
  if (!lastArticle) return redirect("/");

  const content = await lastArticle.fetchContent();

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
        Date: <FormattedDate onlyDate>{lastArticle.date}</FormattedDate>
      </LastUpdate>
    </Article>
  );
}
