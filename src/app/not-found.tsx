import { ArticlePanel } from "@/components/Article";
import PageShell from "@/components/layout/PageShell";
import PageTitle from "@/components/layout/PageTitle";

export default function NotFound() {
  return (
    <PageShell titleSegments={[<PageTitle key="title">Not found</PageTitle>]}>
      <ArticlePanel
        title="Page not found"
        body="You must have gotten lost. Want a train ticket to [the home page](/)?"
        className="flex flex-col items-center justify-center"
      />
    </PageShell>
  );
}
