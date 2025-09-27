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
import { type Article as ArticleType, fetchArticles } from "@/lib/article";

export default async function LatestNews() {
  const articles = await fetchArticles();
  const lastArticle = Object.entries(articles)
    .filter(([key, _]) => key !== "__resources__")
    .map(([_, article]) => article)
    .reduce<ArticleType | null>((previous, current) => {
      if (previous === null) {
        return current;
      } else {
        return current.date > previous.date ? current : previous;
      }
    }, null);

  const content = await lastArticle?.fetchContent();

  return (
    <Article>
      {lastArticle ? (
        <>
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
        </>
      ) : (
        <h1>No article found!</h1>
      )}
    </Article>
  );
}
