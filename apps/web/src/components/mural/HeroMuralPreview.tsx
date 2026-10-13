/** Kolkata-flavored static mural preview for the landing hero */
export function HeroMuralPreview() {
  return (
    <div
      className="paper-grain relative h-full min-h-[420px] w-full overflow-hidden bg-[#d9cbb6] sm:min-h-[520px] lg:min-h-full"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 960 720"
        className="absolute inset-0 h-full w-full animate-drift"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e7d7bf" />
            <stop offset="55%" stopColor="#d4c0a4" />
            <stop offset="100%" stopColor="#c4ad8d" />
          </linearGradient>
          <radialGradient id="lamp" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d0892f" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#d0892f" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="960" height="720" fill="url(#sky)" />

        {/* Tram wires */}
        <g stroke="#3a342c" strokeOpacity="0.35" fill="none">
          <path d="M40 180 C260 140, 520 210, 920 150" strokeWidth="1.2" />
          <path d="M20 210 C300 170, 560 240, 940 180" strokeWidth="1" />
        </g>

        {/* Howrah-like span suggestion */}
        <path
          d="M80 430 Q480 280 880 430"
          fill="none"
          stroke="#33402e"
          strokeOpacity="0.45"
          strokeWidth="2"
        />
        <path
          d="M140 430 Q480 340 820 430"
          fill="none"
          stroke="#33402e"
          strokeOpacity="0.25"
          strokeWidth="1.2"
        />

        {/* Street / tram body */}
        <g fill="none" stroke="#1a1612" strokeOpacity="0.5" strokeWidth="1.5">
          <rect x="210" y="400" width="160" height="48" rx="2" />
          <circle cx="235" cy="455" r="8" />
          <circle cx="345" cy="455" r="8" />
          <rect x="225" y="412" width="28" height="18" />
          <rect x="265" y="412" width="28" height="18" />
          <rect x="305" y="412" width="28" height="18" />
        </g>

        {/* Buildings */}
        <g fill="none" stroke="#1a1612" strokeOpacity="0.42" strokeWidth="1.4">
          <rect x="480" y="250" width="70" height="180" />
          <rect x="560" y="210" width="58" height="220" />
          <rect x="630" y="270" width="90" height="160" />
          <rect x="740" y="230" width="64" height="200" />
        </g>

        {/* Coffee / books motifs */}
        <g stroke="#4f6348" strokeOpacity="0.65" fill="none" strokeWidth="1.3">
          <path d="M140 300 c10-22 34-22 44 0" />
          <ellipse cx="162" cy="310" rx="22" ry="8" />
          <rect x="820" y="320" width="18" height="28" />
          <rect x="842" y="312" width="16" height="36" />
          <rect x="862" y="326" width="14" height="22" />
        </g>

        <circle cx="300" cy="240" r="48" fill="url(#lamp)" />
        <circle cx="700" cy="200" r="36" fill="url(#lamp)" />

        <text
          x="56"
          y="72"
          fill="#6a6156"
          fontFamily="Georgia, serif"
          fontSize="18"
          letterSpacing="2"
        >
          KOLKATA · DEMO EPOCH
        </text>
        <text
          x="56"
          y="98"
          fill="#978e82"
          fontFamily="Georgia, serif"
          fontSize="14"
        >
          College Street corridor · illustrative mural
        </text>
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1612]/55 via-transparent to-[#1a1612]/25" />
    </div>
  );
}
