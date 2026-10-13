import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function MePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-lg flex-1 px-5 py-16">
        <h1 className="font-display text-3xl text-ink">Your archive</h1>
        <p className="mt-3 text-sm text-ink-muted">
          Author profile and published memories will appear here after wallet
          or session onboarding (Phase 6–7). Exploration never requires an
          account.
        </p>
        <Link href="/map" className="mt-8 inline-block text-sm underline">
          Explore the map
        </Link>
      </main>
    </div>
  );
}
