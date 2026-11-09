export function AboutScene() {
  return (
    <svg viewBox="0 0 400 340" className="ab-svg" role="img" aria-label="Open book with students rising from it">
      <circle cx="200" cy="170" r="150" fill="#fff" opacity=".65" />
      <circle cx="200" cy="170" r="112" fill="none" stroke="#19b896" strokeWidth="2" strokeDasharray="6 9" opacity=".55" />
      <circle cx="200" cy="170" r="76" fill="none" stroke="#f0ae1e" strokeWidth="2" opacity=".5" />

      {/* open book */}
      <path d="M200 252 C160 226 100 226 56 242 L56 272 C100 256 160 256 200 282Z" fill="#12806a" />
      <path d="M200 252 C240 226 300 226 344 242 L344 272 C300 256 240 256 200 282Z" fill="#0e4a42" />
      <path d="M200 242 C160 213 100 213 60 228 L60 258 C100 243 160 243 200 270Z" fill="#fff" />
      <path d="M200 242 C240 213 300 213 340 228 L340 258 C300 243 240 243 200 270Z" fill="#effaf6" />
      <path d="M85 236 C115 228 150 230 182 246 M85 246 C115 238 150 240 182 256" stroke="#b5e3d6" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M318 236 C288 228 252 230 218 246 M318 246 C288 238 252 240 218 256" stroke="#b5e3d6" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* side students */}
      <g className="ab-bob2">
        <circle cx="118" cy="160" r="11" fill="#19b896" />
        <path d="M90 190 L118 238 L146 190 L132 190 L118 214 L104 190Z" fill="#19b896" />
      </g>
      <g className="ab-bob2" style={{ animationDelay: ".6s" }}>
        <circle cx="282" cy="160" r="11" fill="#19b896" />
        <path d="M254 190 L282 238 L310 190 L296 190 L282 214 L268 190Z" fill="#19b896" />
      </g>

      {/* centre student with cap */}
      <g className="ab-bob">
        <circle cx="200" cy="118" r="17" fill="#f0ae1e" />
        <path d="M180 98 L200 88 L220 98 L200 108Z" fill="#0e4a42" />
        <path d="M190 104 L190 112 Q200 117 210 112 L210 104 L200 109Z" fill="#12806a" />
        <path d="M158 150 L200 240 L242 150 L222 150 L200 198 L178 150Z" fill="#f0ae1e" />
      </g>

      {/* floating decorations */}
      <g className="ab-float">
        <path d="M60 80 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6z" fill="#f0ae1e" />
      </g>
      <g className="ab-float" style={{ animationDelay: "1s" }}>
        <path d="M340 70 l5 11 11 5 -11 5 -5 11 -5 -11 -11 -5 11 -5z" fill="#19b896" />
      </g>
      <circle cx="320" cy="130" r="6" fill="#f0ae1e" opacity=".7" />
      <circle cx="75" cy="150" r="5" fill="#19b896" opacity=".6" />
    </svg>
  );
}

export function StepIcon({ n }) {
  return (
    <svg viewBox="0 0 80 80" className="step-svg" aria-hidden="true">
      <circle cx="40" cy="40" r="38" fill="#dff5ee" />
      {n === 1 && (
        <g>
          <circle cx="38" cy="42" r="20" fill="#fff" stroke="#19b896" strokeWidth="4" />
          <circle cx="38" cy="42" r="12" fill="#fff" stroke="#f0ae1e" strokeWidth="4" />
          <circle cx="38" cy="42" r="4" fill="#0e4a42" />
          <path d="M40 40 L62 18" stroke="#0e4a42" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M54 16 L64 16 L64 26" stroke="#0e4a42" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {n === 2 && (
        <g>
          <circle cx="35" cy="35" r="17" fill="#fff" stroke="#19b896" strokeWidth="5" />
          <path d="M48 48 L64 64" stroke="#f0ae1e" strokeWidth="7" strokeLinecap="round" />
          <path d="M27 36 L33 42 L44 29" stroke="#0e4a42" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {n === 3 && (
        <g>
          <rect x="21" y="16" width="38" height="48" rx="7" fill="#fff" stroke="#19b896" strokeWidth="4" />
          <path d="M29 30 L34 35 L42 26" stroke="#f0ae1e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M47 31 H53" stroke="#b5e3d6" strokeWidth="4" strokeLinecap="round" />
          <path d="M29 47 L34 52 L42 43" stroke="#f0ae1e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M47 48 H53" stroke="#b5e3d6" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

const SCENES = [
  { bg1: "#dff5ee", bg2: "#b5e3d6", shirt: "#19b896", skin: "#c68a5e", hair: "#2b1b12", prop: "cross" },
  { bg1: "#fff4d9", bg2: "#ffe0a0", shirt: "#f0ae1e", skin: "#e0b08a", hair: "#3a2418", prop: "chart" },
  { bg1: "#e6f0ff", bg2: "#c9dcff", shirt: "#5b7be0", skin: "#a8714a", hair: "#1c120c", prop: "doc" },
];

export function StoryArt({ variant = 0 }) {
  const v = SCENES[variant % SCENES.length];
  const gid = `sg${variant}`;
  return (
    <svg viewBox="0 0 300 185" className="story-art" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={v.bg1} />
          <stop offset="1" stopColor={v.bg2} />
        </linearGradient>
      </defs>
      <rect width="300" height="185" fill={`url(#${gid})`} />
      <circle cx="255" cy="28" r="62" fill="#fff" opacity=".35" />
      <circle cx="35" cy="175" r="52" fill="#fff" opacity=".3" />

      <g className="ab-bob">
        <path d="M80 185 Q80 126 135 126 Q190 126 190 185Z" fill={v.shirt} />
        <rect x="123" y="108" width="24" height="22" rx="8" fill={v.skin} />
        <circle cx="135" cy="88" r="30" fill={v.skin} />
        <path d="M105 86 Q103 52 135 54 Q169 52 165 88 Q155 68 135 68 Q115 68 105 86Z" fill={v.hair} />
        <circle cx="124" cy="92" r="2.6" fill="#2b1b12" />
        <circle cx="146" cy="92" r="2.6" fill="#2b1b12" />
        <path d="M126 102 Q135 110 144 102" stroke="#2b1b12" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="115" cy="100" r="5" fill="#ff9a8a" opacity=".35" />
        <circle cx="155" cy="100" r="5" fill="#ff9a8a" opacity=".35" />
      </g>

      <g className="ab-float">
        <rect x="205" y="48" width="64" height="64" rx="16" fill="#fff" />
        {v.prop === "cross" && <path d="M237 62 V98 M219 80 H255" stroke="#19b896" strokeWidth="10" strokeLinecap="round" />}
        {v.prop === "chart" && (
          <g>
            <rect x="217" y="82" width="9" height="18" rx="3" fill="#f0ae1e" />
            <rect x="232" y="68" width="9" height="32" rx="3" fill="#19b896" />
            <rect x="247" y="76" width="9" height="24" rx="3" fill="#0e4a42" />
          </g>
        )}
        {v.prop === "doc" && (
          <g>
            <path d="M219 64 H255 M219 77 H255 M219 90 H241" stroke="#5b7be0" strokeWidth="5" strokeLinecap="round" />
            <circle cx="253" cy="96" r="7" fill="#f0ae1e" />
          </g>
        )}
      </g>
    </svg>
  );
}