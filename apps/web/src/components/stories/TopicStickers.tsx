/** Topic stickers for story scrapbook — rain, adda, cafe, transit */

import type { ReactNode } from "react";

type SvgProps = { className?: string };

export function StickerUmbrellaKid({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 140 160" className={className} aria-hidden="true">
      <ellipse cx="70" cy="150" rx="40" ry="7" fill="#1a1612" opacity="0.12" />
      <path d="M18 58 Q70 10 122 58 L116 66 Q70 32 24 66 Z" fill="#5a9fd4" stroke="#1a1612" strokeWidth="2.2" />
      <path d="M40 58 Q70 38 100 58" fill="#7ec8ff" stroke="#1a1612" strokeWidth="1.4" />
      <line x1="70" y1="58" x2="70" y2="100" stroke="#1a1612" strokeWidth="2.4" />
      <circle cx="70" cy="78" r="18" fill="#ffd0a8" stroke="#1a1612" strokeWidth="2" />
      <circle cx="64" cy="76" r="2.5" fill="#1a1612" />
      <circle cx="78" cy="76" r="2.5" fill="#1a1612" />
      <path d="M64 86 Q70 90 76 86" fill="none" stroke="#1a1612" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M52 96 Q70 130 88 96" fill="#e87860" stroke="#1a1612" strokeWidth="1.8" />
      <g stroke="#7ec8ff" strokeWidth="2" strokeLinecap="round">
        <line x1="28" y1="28" x2="24" y2="40" />
        <line x1="50" y1="18" x2="48" y2="32" />
        <line x1="90" y1="20" x2="92" y2="34" />
        <line x1="112" y1="30" x2="116" y2="42" />
      </g>
    </svg>
  );
}

export function StickerRadio({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 140 120" className={className} aria-hidden="true">
      <ellipse cx="70" cy="112" rx="42" ry="6" fill="#1a1612" opacity="0.1" />
      <rect x="22" y="36" width="96" height="64" rx="10" fill="#ffc53d" stroke="#1a1612" strokeWidth="2.2" />
      <rect x="34" y="48" width="48" height="28" rx="4" fill="#1a1612" />
      <circle cx="54" cy="62" r="3" fill="#b8e86a" />
      <circle cx="98" cy="56" r="10" fill="#e87860" stroke="#1a1612" strokeWidth="1.8" />
      <circle cx="98" cy="78" r="7" fill="#7ec8ff" stroke="#1a1612" strokeWidth="1.6" />
      <path d="M40 28 L70 12 L100 28" fill="none" stroke="#1a1612" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="70" cy="12" r="4" fill="#ff8fb5" stroke="#1a1612" strokeWidth="1.4" />
    </svg>
  );
}

export function StickerCards({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 130 120" className={className} aria-hidden="true">
      <rect x="18" y="28" width="52" height="72" rx="6" fill="#fff3c4" stroke="#1a1612" strokeWidth="2" transform="rotate(-12 44 64)" />
      <rect x="48" y="24" width="52" height="72" rx="6" fill="#ffd0e8" stroke="#1a1612" strokeWidth="2" transform="rotate(8 74 60)" />
      <text x="66" y="66" fontSize="22" fill="#c45c48" fontFamily="Georgia, serif">A♥</text>
      <circle cx="34" cy="48" r="6" fill="#e87860" />
    </svg>
  );
}

export function StickerChai({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden="true">
      <ellipse cx="55" cy="120" rx="36" ry="6" fill="#1a1612" opacity="0.1" />
      <path d="M28 50 L36 100 H74 L82 50 Z" fill="#e87860" stroke="#1a1612" strokeWidth="2.2" />
      <ellipse cx="55" cy="50" rx="28" ry="9" fill="#fff3c4" stroke="#1a1612" strokeWidth="1.8" />
      <ellipse cx="55" cy="48" rx="20" ry="5" fill="#c45c48" opacity="0.55" />
      <path d="M82 62 Q102 62 102 80 Q102 96 82 96" fill="none" stroke="#1a1612" strokeWidth="2.2" />
      <path d="M44 28 Q48 16 52 28" fill="none" stroke="#2f6f72" strokeWidth="2" />
      <path d="M56 26 Q60 12 64 26" fill="none" stroke="#2f6f72" strokeWidth="2" />
      <path d="M68 30 Q72 18 76 30" fill="none" stroke="#2f6f72" strokeWidth="2" />
    </svg>
  );
}

export function StickerRickshaw({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <ellipse cx="80" cy="112" rx="50" ry="6" fill="#1a1612" opacity="0.1" />
      <path d="M30 70 H110 L120 48 H70 L60 70 Z" fill="#ffc53d" stroke="#1a1612" strokeWidth="2" />
      <circle cx="48" cy="88" r="14" fill="#1a1612" />
      <circle cx="48" cy="88" r="6" fill="#ffc53d" />
      <circle cx="108" cy="88" r="14" fill="#1a1612" />
      <circle cx="108" cy="88" r="6" fill="#ffc53d" />
      <circle cx="78" cy="40" r="14" fill="#ffd0a8" stroke="#1a1612" strokeWidth="1.8" />
      <circle cx="74" cy="38" r="2" fill="#1a1612" />
      <circle cx="84" cy="38" r="2" fill="#1a1612" />
      <path d="M74 46 Q78 50 84 46" fill="none" stroke="#1a1612" strokeWidth="1.5" />
      <path d="M40 48 Q50 28 70 36" fill="none" stroke="#1a1612" strokeWidth="2" />
    </svg>
  );
}

export function StickerCloudRain({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 130 110" className={className} aria-hidden="true">
      <ellipse cx="58" cy="42" rx="34" ry="22" fill="#c8e4ff" stroke="#1a1612" strokeWidth="2" />
      <ellipse cx="84" cy="46" rx="26" ry="18" fill="#a8d4f5" stroke="#1a1612" strokeWidth="2" />
      <g stroke="#5a9fd4" strokeWidth="2.4" strokeLinecap="round">
        <line x1="40" y1="72" x2="36" y2="92" />
        <line x1="58" y1="70" x2="56" y2="96" />
        <line x1="76" y1="72" x2="80" y2="94" />
        <line x1="94" y1="70" x2="98" y2="90" />
      </g>
    </svg>
  );
}

export function PlasticSticker({
  children,
  color,
  className,
}: {
  children: ReactNode;
  color: string;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl p-2 ${className ?? ""}`}
      style={{
        background: `linear-gradient(145deg, ${color} 0%, ${color}ee 55%, #ffffff55 100%)`,
        boxShadow:
          "0 2px 0 #fff8 inset, 0 -3px 8px rgba(0,0,0,0.08) inset, 0 14px 28px -10px rgba(26,22,18,0.45), 0 4px 0 rgba(26,22,18,0.15)",
        border: "3px solid #1a1612",
      }}
    >
      <span
        className="pointer-events-none absolute inset-x-3 top-1 h-2 rounded-full opacity-50"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
        }}
      />
      {children}
    </div>
  );
}
