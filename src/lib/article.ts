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

export async function fetchArticles(): Promise<{ [slug: string ]: Article }> {
  const file = await fs.readFile(process.cwd() + '/data/articles.json', 'utf-8');
  const articles: { [slug: string]: RawArticle } = JSON.parse(file);

  return Object.fromEntries(Object.entries(articles).map(([key, raw]) => {
    return [key, {
      ...raw,
      // The typechecker seems to struggle to type the `content` field XD
      content: (<T>(a: T): T => a)<string | undefined>(undefined),
      fetchContent: async function () {
        if (this.content) {
          return this.content;
        }
        this.content = await fs.readFile(process.cwd() + this.path, 'utf-8');
        return this.content;
      }
    }];
  }));
}