export const COURSE_OPTIONS = [
  "BSc Nursing", "GNM", "BOT", "BPT", "BBA", "BCA", "Other UG / PG course", "Not sure yet",
];

export const QUALIFICATIONS = [
  "10th / SSLC", "Plus Two / 12th", "Diploma", "Degree", "Postgraduate", "Other",
];

export const COURSES = [
  {
    cat: "health", a: "#5b45e0", b: "#8a6cf5", tag: "Healthcare", title: "BSc Nursing",
    desc: "Explore undergraduate nursing education and admission options.",
    links: [{ label: "Enquire about this course →", course: "BSc Nursing" }],
    art: `<svg viewBox="0 0 260 150" aria-hidden="true">
 <circle cx="130" cy="72" r="46" fill="#fff" opacity=".95"/>
 <rect x="119" y="46" width="22" height="52" rx="6" fill="#e0562a"/><rect x="104" y="61" width="52" height="22" rx="6" fill="#e0562a"/>
 <path class="ecg" d="M10 124h58l10-22 14 40 12-30 8 12h148" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
 <g class="float" fill="#fff" opacity=".7"><rect x="30" y="26" width="5" height="16" rx="2"/><rect x="24.5" y="31.5" width="16" height="5" rx="2"/><rect x="214" y="40" width="5" height="16" rx="2"/><rect x="208.5" y="45.5" width="16" height="5" rx="2"/></g></svg>`,
  },
  {
    cat: "health", a: "#c2486f", b: "#e0562a", tag: "Healthcare", title: "GNM",
    desc: "Learn about General Nursing and Midwifery study pathways.",
    links: [{ label: "Enquire about this course →", course: "GNM" }],
    art: `<svg viewBox="0 0 260 150" aria-hidden="true">
 <path class="beat" d="M130 112C70 74 80 30 108 30c13 0 22 8 22 8s9-8 22-8c28 0 38 44-22 82z" fill="#fff" opacity=".96"/>
 <path d="M122 62h16M130 54v16" stroke="#e0562a" stroke-width="7" stroke-linecap="round"/>
 <path d="M28 116c30-18 52-8 78 6M232 116c-30-18-52-8-78 6" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".55"/>
 <g class="float" fill="#fff" opacity=".75"><circle cx="40" cy="38" r="5"/><circle cx="222" cy="30" r="4"/><circle cx="206" cy="78" r="3"/></g></svg>`,
  },
  {
    cat: "health", a: "#16a36a", b: "#2a8ee0", tag: "Healthcare", title: "BOT & BPT",
    desc: "Explore opportunities in occupational and physiotherapy education.",
    links: [
      { label: "Enquire BOT →", course: "BOT" },
      { label: "Enquire BPT →", course: "BPT" },
    ],
    art: `<svg viewBox="0 0 260 150" aria-hidden="true">
 <circle cx="130" cy="75" r="52" fill="#fff" opacity=".18"/>
 <circle cx="130" cy="42" r="15" fill="#fff"/>
 <path d="M104 112c0-26 10-42 26-42s26 16 26 42z" fill="#fff"/>
 <g class="lift"><rect x="60" y="38" width="8" height="30" rx="3" fill="#ffb84d"/><rect x="92" y="38" width="8" height="30" rx="3" fill="#ffb84d"/><rect x="68" y="50" width="24" height="6" rx="3" fill="#fff"/><rect x="52" y="44" width="8" height="18" rx="3" fill="#fff"/><rect x="100" y="44" width="8" height="18" rx="3" fill="#fff"/></g>
 <path d="M158 80c22 0 36 14 44 34" fill="none" stroke="#ffb84d" stroke-width="7" stroke-linecap="round"/>
 <path d="M24 128h212" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/></svg>`,
  },
  {
    cat: "biz", a: "#e0562a", b: "#ffb84d", tag: "Business", title: "BBA",
    desc: "Find out about business administration study options.",
    links: [{ label: "Enquire about this course →", course: "BBA" }],
    art: `<svg viewBox="0 0 260 150" aria-hidden="true">
 <rect x="40" y="22" width="180" height="104" rx="14" fill="#fff" opacity=".96"/>
 <g><rect class="gb b1" x="68" y="76" width="22" height="38" rx="5" fill="#8a6cf5"/><rect class="gb b2" x="104" y="58" width="22" height="56" rx="5" fill="#5b45e0"/><rect class="gb b3" x="140" y="44" width="22" height="70" rx="5" fill="#e0562a"/><rect class="gb b4" x="176" y="34" width="22" height="80" rx="5" fill="#ffb84d"/></g>
 <path d="M62 66l36-16 30 4 56-24" fill="none" stroke="#1b1a4e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 6" opacity=".55"/>
 <circle cx="224" cy="30" r="5" fill="#fff" class="float"/></svg>`,
  },
  {
    cat: "tech", a: "#2a2870", b: "#5b45e0", tag: "Technology", title: "BCA",
    desc: "Explore undergraduate computer applications programmes.",
    links: [{ label: "Enquire about this course →", course: "BCA" }],
    art: `<svg viewBox="0 0 260 150" aria-hidden="true">
 <rect x="62" y="24" width="136" height="88" rx="10" fill="#1b1a4e"/>
 <rect x="68" y="30" width="124" height="76" rx="6" fill="#2a2870"/>
 <g class="code" stroke-linecap="round" stroke-width="5"><path d="M80 48h34" stroke="#ffb84d"/><path d="M80 62h60" stroke="#fff"/><path d="M92 76h44" stroke="#8a6cf5"/><path d="M80 90h28" stroke="#e0562a"/></g>
 <path d="M44 118h172l-12 14H56z" fill="#fff" opacity=".9"/>
 <text class="float" x="24" y="52" font-family="monospace" font-size="22" font-weight="700" fill="#fff" opacity=".8">&lt;/&gt;</text>
 <text class="float" x="200" y="78" font-family="monospace" font-size="20" font-weight="700" fill="#fff" opacity=".7">{ }</text></svg>`,
  },
  {
    cat: "more", a: "#1b1a4e", b: "#c2486f", tag: "More options", title: "UG & PG Programmes",
    desc: "Ask us about other undergraduate and postgraduate courses.",
    links: [{ label: "Enquire about this course →", course: "Other UG / PG course" }],
    art: `<svg viewBox="0 0 260 150" aria-hidden="true">
 <rect x="62" y="104" width="136" height="14" rx="4" fill="#fff" opacity=".9"/><rect x="72" y="90" width="116" height="14" rx="4" fill="#ffb84d"/><rect x="82" y="76" width="96" height="14" rx="4" fill="#fff" opacity=".8"/>
 <g class="cap"><path d="M130 22l-70 28 70 28 70-28z" fill="#1b1a4e"/><path d="M92 62v18c10 8 26 12 38 12s28-4 38-12V62l-38 15z" fill="#2a2870"/><path d="M198 50v30" stroke="#ffb84d" stroke-width="4" stroke-linecap="round"/><circle cx="198" cy="84" r="6" fill="#ffb84d"/></g>
 <g class="float" fill="#fff" opacity=".8"><circle cx="34" cy="40" r="4"/><circle cx="228" cy="26" r="5"/><circle cx="40" cy="96" r="3"/></g></svg>`,
  },
];
