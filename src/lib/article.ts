import { promises as fs } from "fs";

interface RawArticle {
  path: string,
  date: string,
  hide: boolean,
  authors: string[],
}

export type Article = RawArticle & {
  content?: string,
  fetchContent: () => Promise<string>,
};

export type Articles = {
  [slug: string]: Article;
};

export async function fetchArticles(): Promise<Articles> {
  const file = await fs.readFile(process.cwd() + '/data/articles.json', 'utf-8');
  const articles: RawArticle = JSON.parse(file);
  const entries = Object.entries(articles).map(([key, value]) => {
    return [key, {
      ...value,
      content: null,
      fetchContent: async function() {
        this.content = await fs.readFile(process.cwd() + this.path, 'utf-8');
        return this.content;
      }
    }];
  });
  return Object.fromEntries(entries);
}