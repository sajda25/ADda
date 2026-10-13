import Link from "next/link";
import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { StoryReader } from "@/components/stories/StoryReader";

type Props = {
  params: Promise<{ id: string }>;
};

async function StoryBody({ params }: Props) {
  const { id } = await params;
  return <StoryReader storyId={id} />;
}

export default function StoryPage({ params }: Props) {
  return (
    <div className="ms-story-shell bg-[#e8c9a8]">
      <SiteHeader />
      <Suspense
        fallback={
          <main className="ms-section-scrap mx-auto w-full max-w-2xl px-5 py-16">
            <p className="font-hand text-xl text-[#5c3a2e]">
              Loading this diary page…
            </p>
            <Link
              href="/map"
              className="mt-6 inline-block text-sm font-semibold text-[#5c2430] underline"
            >
              Back to map
            </Link>
          </main>
        }
      >
        <StoryBody params={params} />
      </Suspense>
    </div>
  );
}
