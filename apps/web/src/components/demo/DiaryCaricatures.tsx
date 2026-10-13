/** Hand-drawn caricature SVGs for the diary landing */

import type { ReactNode } from "react";
import { PhotoCorners } from "@/components/demo/ScrapbookBits";

type SvgProps = { className?: string; title?: string };

export function CoffeeDada({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 160 180" className={className} aria-hidden="true">
      <ellipse cx="80" cy="168" rx="48" ry="8" fill="#1a1612" opacity="0.12" />
      <ellipse cx="80" cy="118" rx="42" ry="48" fill="#ff8f6a" stroke="#1a1612" strokeWidth="2.2" />
      <circle cx="80" cy="58" r="36" fill="#ffd0a8" stroke="#1a1612" strokeWidth="2.2" />
      <ellipse cx="80" cy="42" rx="38" ry="14" fill="#5c2430" />
      <path d="M48 48 Q80 28 112 48" fill="none" stroke="#1a1612" strokeWidth="2" />
      <circle cx="66" cy="58" r="4" fill="#1a1612" />
      <circle cx="94" cy="58" r="4" fill="#1a1612" />
      <ellipse cx="58" cy="68" rx="6" ry="3.5" fill="#ff8fb5" opacity="0.7" />
      <ellipse cx="102" cy="68" rx="6" ry="3.5" fill="#ff8fb5" opacity="0.7" />
      <path d="M68 74 Q80 82 92 74" fill="none" stroke="#1a1612" strokeWidth="2" strokeLinecap="round" />
      <rect x="58" y="98" width="44" height="34" rx="6" fill="#e8b048" stroke="#1a1612" strokeWidth="2" />
      <path d="M102 108 Q118 108 118 126 Q118 140 102 140" fill="none" stroke="#1a1612" strokeWidth="2.2" />
      <ellipse cx="80" cy="104" rx="14" ry="5" fill="#fff3c4" opacity="0.7" />
      <path d="M72 92 Q76 84 80 92 Q84 84 88 92" fill="none" stroke="#2f6f72" strokeWidth="1.8" />
    </svg>
  );
}

export function TramKid({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 180 140" className={className} aria-hidden="true">
      <ellipse cx="90" cy="130" rx="60" ry="7" fill="#1a1612" opacity="0.1" />
      <rect x="28" y="48" width="124" height="58" rx="8" fill="#ffc53d" stroke="#1a1612" strokeWidth="2.2" />
      <rect x="40" y="58" width="28" height="22" rx="3" fill="#7ec8ff" stroke="#1a1612" strokeWidth="1.5" />
      <rect x="76" y="58" width="28" height="22" rx="3" fill="#ff8fb5" stroke="#1a1612" strokeWidth="1.5" />
      <rect x="112" y="58" width="28" height="22" rx="3" fill="#b8e86a" stroke="#1a1612" strokeWidth="1.5" />
      <circle cx="52" cy="112" r="10" fill="#1a1612" />
      <circle cx="128" cy="112" r="10" fill="#1a1612" />
      <circle cx="52" cy="112" r="4" fill="#ffc53d" />
      <circle cx="128" cy="112" r="4" fill="#ffc53d" />
      <circle cx="90" cy="36" r="18" fill="#ffd0a8" stroke="#1a1612" strokeWidth="2" />
      <circle cx="84" cy="34" r="2.5" fill="#1a1612" />
      <circle cx="96" cy="34" r="2.5" fill="#1a1612" />
      <path d="M84 42 Q90 46 96 42" fill="none" stroke="#1a1612" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M70 28 Q90 12 110 28" fill="#2f6f72" stroke="#1a1612" strokeWidth="1.5" />
      <line x1="20" y1="40" x2="160" y2="40" stroke="#e87860" strokeOpacity="0.7" strokeWidth="1.6" />
    </svg>
  );
}

export function Bookworm({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 150 160" className={className} aria-hidden="true">
      <ellipse cx="75" cy="150" rx="40" ry="7" fill="#1a1612" opacity="0.1" />
      <rect x="38" y="70" width="74" height="68" rx="4" fill="#c45c8a" stroke="#1a1612" strokeWidth="2" />
      <rect x="44" y="76" width="62" height="56" fill="#fff3c4" stroke="#1a1612" strokeWidth="1.4" />
      <line x1="52" y1="88" x2="98" y2="88" stroke="#9a4e8a" strokeWidth="1.4" />
      <line x1="52" y1="100" x2="92" y2="100" stroke="#2f6f72" strokeWidth="1.4" />
      <line x1="52" y1="112" x2="96" y2="112" stroke="#e87860" strokeWidth="1.4" />
      <circle cx="75" cy="42" r="28" fill="#6ecf7a" stroke="#1a1612" strokeWidth="2" />
      <circle cx="66" cy="40" r="3.5" fill="#1a1612" />
      <circle cx="84" cy="40" r="3.5" fill="#1a1612" />
      <circle cx="67" cy="39" r="1.2" fill="#fff" />
      <circle cx="85" cy="39" r="1.2" fill="#fff" />
      <path d="M66 52 Q75 58 84 52" fill="none" stroke="#1a1612" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M58 22 Q62 8 68 20" fill="none" stroke="#1a1612" strokeWidth="1.6" />
      <path d="M82 20 Q88 6 94 22" fill="none" stroke="#1a1612" strokeWidth="1.6" />
      <circle cx="68" cy="18" r="3.5" fill="#ff8fb5" />
      <circle cx="94" cy="18" r="3.5" fill="#7ec8ff" />
    </svg>
  );
}

export function RainAuntie({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 140 170" className={className} aria-hidden="true">
      <ellipse cx="70" cy="160" rx="36" ry="6" fill="#1a1612" opacity="0.1" />
      <path
        d="M28 70 Q70 28 112 70 L108 78 Q70 48 32 78 Z"
        fill="#5a9fd4"
        stroke="#1a1612"
        strokeWidth="2"
      />
      <line x1="70" y1="70" x2="70" y2="118" stroke="#1a1612" strokeWidth="2.2" />
      <circle cx="70" cy="88" r="22" fill="#ffd0a8" stroke="#1a1612" strokeWidth="2" />
      <path d="M52 82 Q70 70 88 82" fill="#5c2430" />
      <circle cx="62" cy="88" r="2.8" fill="#1a1612" />
      <circle cx="78" cy="88" r="2.8" fill="#1a1612" />
      <path d="M62 98 Q70 104 78 98" fill="none" stroke="#1a1612" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M48 110 Q70 140 92 110" fill="#9a4e8a" stroke="#1a1612" strokeWidth="1.8" />
      <g stroke="#7ec8ff" strokeWidth="2" strokeLinecap="round">
        <line x1="30" y1="40" x2="26" y2="52" />
        <line x1="50" y1="32" x2="48" y2="46" />
        <line x1="90" y1="34" x2="92" y2="48" />
        <line x1="110" y1="42" x2="114" y2="54" />
      </g>
    </svg>
  );
}

const polaroidThemes = {
  coral: { frame: "#ffd0b8", well: "#ffb090", tape: "ms-washi--coral", ink: "#8b2e1f" },
  mint: { frame: "#b8f0e4", well: "#7ed9c8", tape: "ms-washi--teal", ink: "#1a4f52" },
  sun: { frame: "#ffe49a", well: "#ffd060", tape: "ms-washi--sun", ink: "#6a4a10" },
} as const;

export function PolaroidFrame({
  children,
  caption,
  className,
  rotate = -6,
  theme = "coral",
}: {
  children: ReactNode;
  caption: string;
  className?: string;
  rotate?: number;
  theme?: keyof typeof polaroidThemes;
}) {
  const t = polaroidThemes[theme];
  return (
    <div
      className={`relative p-2 pb-8 shadow-[0_14px_40px_-14px_rgba(26,22,18,0.55)] ring-2 ring-ink/20 ${className ?? ""}`}
      style={{ transform: `rotate(${rotate}deg)`, background: t.frame }}
    >
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden"
        style={{ background: t.well }}
      >
        {children}
        <PhotoCorners />
      </div>
      <p
        className="font-hand absolute inset-x-2 bottom-1.5 text-center text-sm font-semibold"
        style={{ color: t.ink }}
      >
        {caption}
      </p>
      <span
        className={`ms-washi absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 rotate-[-2deg] ${t.tape}`}
      />
      <span className="ms-washi ms-washi--dots absolute -right-1 bottom-10 h-3 w-10 rotate-90" />
    </div>
  );
}
