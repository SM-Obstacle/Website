import "katex/dist/katex.min.css";

import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import { markdownComponents } from "@/components/Article";
import RankingHelpDialog from "./RankingHelpDialog";
import { RANKING_DOCS, type RankingKind } from "./rankingDocs";

/**
 * The "?" button explaining a ranking, for the title bar.
 *
 * A server component: the Markdown and its formulas are rendered to HTML here,
 * so the client only receives KaTeX's stylesheet and fonts, not KaTeX itself.
 * The dialog around it is the only client part.
 */
export default function RankingDoc({ ranking }: { ranking: RankingKind }) {
  const { title, body } = RANKING_DOCS[ranking];

  return (
    <RankingHelpDialog title={title}>
      <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={markdownComponents}
      >
        {body}
      </Markdown>
    </RankingHelpDialog>
  );
}
