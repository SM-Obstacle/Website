import { promises as fs } from "node:fs";

import { parseApiDate } from "./date";

/**
 * The resources page lives in the same file as the articles, but it isn't a
 * dated post: it's a maintained list of links, so it stays out of the feed and
 * has its own route.
 */
export const RESOURCES_SLUG = "__resources__";

interface RawArticle {
  path: string;
  date: string;
  hide?: boolean;
  authors: string[];
}

export interface ArticleDocument {
  /** The article's own `# ` heading — the markdown is the source of truth. */
  title: string;
  /** The markdown after that heading, so the page can lay the title out itself. */
  body: string;
}

export interface Article extends RawArticle {
  slug: string;
  fetchDocument: () => Promise<ArticleDocument>;
  fetchTitle: () => Promise<string>;
}

/**
 * Splits off the leading `# Title`. Only the very first line counts, so an
 * article that opens straight into prose keeps all of its content.
 */
function splitDocument(content: string, fallbackTitle: string): ArticleDocument {
  const heading = content.match(/^\s*#[^\S\n]+(.+?)[^\S\n]*(?:\n|$)/);

  return heading
    ? { title: heading[1], body: content.slice(heading[0].length) }
    : { title: fallbackTitle, body: content };
}

class ArticleImpl implements Article {
  private content?: string;
  slug: string;
  path: string;
  date: string;
  hide?: boolean;
  authors: string[];

  constructor(slug: string, raw: RawArticle) {
    this.slug = slug;
    this.path = raw.path;
    this.date = raw.date;
    this.hide = raw.hide;
    this.authors = raw.authors;
  }

  private async fetchContent() {
    if (this.content === undefined) {
      this.content = await fs.readFile(process.cwd() + this.path, "utf-8");
    }
    return this.content;
  }

  async fetchDocument() {
    return splitDocument(await this.fetchContent(), this.slug);
  }

  async fetchTitle() {
    return (await this.fetchDocument()).title;
  }
}

export async function fetchArticles(): Promise<{ [slug: string]: Article }> {
  const file = await fs.readFile(
    `${process.cwd()}/data/articles.json`,
    "utf-8",
  );
  const articles: { [slug: string]: RawArticle } = JSON.parse(file);

  return Object.fromEntries(
    Object.entries(articles).map(([slug, raw]) => [
      slug,
      new ArticleImpl(slug, raw),
    ]),
  );
}

export interface ArticleSummary {
  slug: string;
  title: string;
  date: string;
  authors: string[];
}

/** Published articles, newest first. */
export async function fetchArticleFeed(): Promise<ArticleSummary[]> {
  const articles = await fetchArticles();

  const published = Object.values(articles).filter(
    (article) => !article.hide && article.slug !== RESOURCES_SLUG,
  );

  const summaries = await Promise.all(
    published.map(async (article) => ({
      slug: article.slug,
      title: await article.fetchTitle(),
      date: article.date,
      authors: article.authors,
    })),
  );

  return summaries.sort(
    (a, b) => parseApiDate(b.date).valueOf() - parseApiDate(a.date).valueOf(),
  );
}
