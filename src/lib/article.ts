import { promises as fs } from "node:fs";

interface RawArticle {
  path: string;
  date: string;
  hide: boolean;
  authors: string[];
}

export interface Article extends RawArticle {
  content?: string;
  fetchContent: () => Promise<string>;
}

class ArticleImpl implements Article {
  content?: string | undefined;
  path: string;
  date: string;
  hide: boolean;
  authors: string[];

  constructor(raw: RawArticle) {
    this.path = raw.path;
    this.date = raw.date;
    this.hide = raw.hide;
    this.authors = raw.authors;
    this.content = undefined;
  }

  async fetchContent() {
    if (this.content) {
      return this.content;
    }
    this.content = await fs.readFile(process.cwd() + this.path, "utf-8");
    return this.content;
  }
}

export async function fetchArticles(): Promise<{ [slug: string]: Article }> {
  const file = await fs.readFile(
    `${process.cwd()}/data/articles.json`,
    "utf-8",
  );
  const articles: { [slug: string]: RawArticle } = JSON.parse(file);

  return Object.fromEntries(
    Object.entries(articles).map(([key, raw]) => {
      return [key, new ArticleImpl(raw)];
    }),
  );
}
