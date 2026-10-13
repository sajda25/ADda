import Link from "next/link";
import { AddaLogo } from "@/components/layout/AddaLogo";

const links = [
  { href: "/map", label: "Story Map" },
  { href: "/demo", label: "Demo" },
  { href: "/#how-it-works", label: "How it works" },
];

export function SiteHeader({
  variant = "solid",
}: {
  variant?: "solid" | "overlay";
}) {
  const overlay = variant === "overlay";

  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30"
          : "relative z-20 border-b border-border bg-paper-raised/85 backdrop-blur-md"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <AddaLogo overlay={overlay} size="md" />
        <nav
          className={`flex items-center gap-4 text-sm sm:gap-6 ${
            overlay ? "text-paper/75" : "text-ink-muted"
          }`}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                overlay ? "hover:text-paper" : "hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
