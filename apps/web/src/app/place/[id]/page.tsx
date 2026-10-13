import Link from "next/link";
import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PlacePageClient } from "@/components/storybook/PlacePageClient";

type Props = {
  params: Promise<{ id: string }>;
};

async function PlaceBody({ params }: Props) {
  const { id } = await params;
  return <PlacePageClient placeId={id} />;
}

export default function PlacePage({ params }: Props) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-16">
            <p className="text-sm text-ink-muted">Loading place…</p>
          </main>
        }
      >
        <PlaceBody params={params} />
      </Suspense>
      <div className="px-5 pb-10">
        <Link href="/map" className="text-sm underline">
          Back to map
        </Link>
      </div>
    </div>
  );
}
