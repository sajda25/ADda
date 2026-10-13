/** Small scrapbook ephemera — tickets, stamps, clips, torn scraps */

import type { ReactNode } from "react";

export function TicketStub({
  className,
  label = "College St.",
  code = "MEM-07",
}: {
  className?: string;
  label?: string;
  code?: string;
}) {
  return (
    <div className={`ms-ticket relative px-3 py-2 ${className ?? ""}`} aria-hidden="true">
      <p className="text-[9px] font-bold tracking-[0.2em] text-[#5c2430] uppercase">
        admit one
      </p>
      <p className="font-hand text-base font-semibold text-[#1a1612]">{label}</p>
      <p className="mt-0.5 text-[10px] tabular-nums text-[#5c2430]/80">{code}</p>
      <span className="ms-ticket-notch ms-ticket-notch--l" />
      <span className="ms-ticket-notch ms-ticket-notch--r" />
    </div>
  );
}

export function PostageStamp({
  className,
  city = "KOL",
}: {
  className?: string;
  city?: string;
}) {
  return (
    <div className={`ms-postage relative flex flex-col items-center justify-center p-2 ${className ?? ""}`} aria-hidden="true">
      <span className="text-[9px] font-bold tracking-widest text-[#1f5c5e]">INDIA</span>
      <span className="font-hand text-2xl font-bold text-[#c45c48]">♡</span>
      <span className="text-[10px] font-semibold text-[#1a1612]">{city}</span>
      <span className="absolute inset-1 border border-dashed border-[#1a1612]/35" />
    </div>
  );
}

export function PaperClip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 70" className={className} aria-hidden="true">
      <path
        d="M12 18 C12 8, 28 8, 28 20 L28 48 C28 58, 12 58, 12 46 L12 22 C12 16, 20 16, 20 24 L20 44"
        fill="none"
        stroke="#7ec8ff"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M12 18 C12 8, 28 8, 28 20 L28 48 C28 58, 12 58, 12 46 L12 22 C12 16, 20 16, 20 24 L20 44"
        fill="none"
        stroke="#1a1612"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

export function PhotoCorners({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ""}`} aria-hidden="true">
      <span className="ms-photo-corner absolute top-1 left-1" />
      <span className="ms-photo-corner ms-photo-corner--tr absolute top-1 right-1" />
      <span className="ms-photo-corner ms-photo-corner--bl absolute bottom-1 left-1" />
      <span className="ms-photo-corner ms-photo-corner--br absolute right-1 bottom-1" />
    </div>
  );
}

export function TornScrap({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`ms-torn relative ${className ?? ""}`} aria-hidden={!children}>
      {children}
    </div>
  );
}

export function StickerStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M32 6 L38 24 L57 24 L42 36 L48 54 L32 43 L16 54 L22 36 L7 24 L26 24 Z"
        fill="#ffc53d"
        stroke="#1a1612"
        strokeWidth="2"
      />
    </svg>
  );
}

export function StickerHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M32 54 C18 42, 8 32, 8 20 C8 12, 14 8, 22 8 C27 8, 30 11, 32 14 C34 11, 37 8, 42 8 C50 8, 56 12, 56 20 C56 32, 46 42, 32 54 Z"
        fill="#ff8fb5"
        stroke="#1a1612"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CoffeeRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <circle
        cx="40"
        cy="40"
        r="28"
        fill="none"
        stroke="#c45c48"
        strokeWidth="3.5"
        opacity="0.28"
      />
      <circle
        cx="40"
        cy="40"
        r="22"
        fill="none"
        stroke="#c45c48"
        strokeWidth="1.5"
        opacity="0.18"
        strokeDasharray="4 6"
      />
    </svg>
  );
}
