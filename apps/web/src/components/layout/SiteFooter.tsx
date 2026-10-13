import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto shrink-0 border-t border-border bg-[#2a1a16] text-paper/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-12 sm:px-8">
        <p className="font-hand text-center text-2xl font-semibold text-[#ffc53d] sm:text-3xl">
          “Every place is still waiting for someone to remember it kindly.”
        </p>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-display text-lg text-paper">ADda</p>
          <p className="max-w-md text-center text-sm leading-relaxed text-paper/55 sm:text-left">
            A living scrapbook of neighborhoods — so no corner, café, or
            goodbye has to disappear alone.
          </p>
          <Link
            href="/map"
            className="ms-btn inline-flex h-10 items-center bg-[#e87860] px-4 text-xs font-semibold text-ink"
          >
            Leave a memory
          </Link>
        </div>
      </div>
    </footer>
  );
}
