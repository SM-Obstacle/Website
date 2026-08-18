import { ArticlePanel } from "@/components/Article";
import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";

export default function NotFound() {
  return (
    <PageShell
      titleSegments={[<PageTitle key="title">Blog</PageTitle>]}
      selectedMenu="articles"
    >
      <ArticlePanel
        title="Not found"
        body="Couldn't find this post."
        className="flex flex-col items-center justify-center"
      />
    </PageShell>
  );
}
