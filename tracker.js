import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* 1) PASTE YOUR FIREBASE WEB CONFIG HERE (Firebase console → Project settings → Your apps) */
const firebaseConfig = {
  apiKey: "AIzaSyACJNjKWv97UGevG7NNTNEJTN4XxVQlV54",
  authDomain: "genuineedusolutions-5e2c2.firebaseapp.com",
  projectId: "genuineedusolutions-5e2c2",
  storageBucket: "genuineedusolutions-5e2c2.firebasestorage.app",
  messagingSenderId: "7797802437",
  appId: "1:7797802437:web:f72b54f67bf4a6e2e677ac",
};

const MAX_EVENTS_PER_SESSION = 150;   // keeps Firestore writes (and cost) bounded
const FLUSH_EVERY_MS = 15000;         // how often the session summary is refreshed

/* ---------- init ---------- */
const DEBUG = true;   // set to false once everything works
const log = (...a) => { if (DEBUG) console.log("[GES]", ...a); };

let db = null;
if (/YOUR_API_KEY|YOUR_PROJECT/.test(JSON.stringify(firebaseConfig))) {
  console.error("[GES] firebaseConfig still has placeholder values – paste your real Firebase config at the top of tracker.js");
} else if (location.protocol === "file:") {
  console.error("[GES] Page opened via file:// – ES modules/Firestore need http(s). Use a local server or upload the site.");
} else {
  try {
    const app = initializeApp(firebaseConfig);
    try {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache(),
        experimentalAutoDetectLongPolling: true   // helps behind ad-blockers / strict networks
      });
    } catch (e) { db = getFirestore(app); }
    log("Firebase initialised for project", firebaseConfig.projectId);
  } catch (e) { console.error("[GES] Firebase init failed", e); }
}

const isBot = navigator.webdriver || /bot|crawl|spider|lighthouse/i.test(navigator.userAgent);

/* ---------- ids ---------- */
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
function stored(store, key) {
  try { let v = store.getItem(key); if (!v) { v = uid(); store.setItem(key, v); } return v; }
  catch (e) { return uid(); }
}
const visitorId = stored(localStorage, "ges_vid");    // same browser, across visits
const sessionId = stored(sessionStorage, "ges_sid");  // one visit

/* ---------- device / source info ---------- */
function deviceInfo() {
  const ua = navigator.userAgent;

  const device = /iPad|Tablet/i.test(ua)
    ? "tablet"
    : /Mobi|Android|iPhone/i.test(ua)
      ? "mobile"
      : "desktop";

  const browser =
    /Edg\//.test(ua) ? "Edge" :
    /OPR\//.test(ua) ? "Opera" :
    /SamsungBrowser/.test(ua) ? "Samsung Internet" :
    /Chrome\//.test(ua) ? "Chrome" :
    /Firefox\//.test(ua) ? "Firefox" :
    /Safari\//.test(ua) ? "Safari" :
    "Other";

  const os =
    /Android/.test(ua) ? "Android" :
    /iPhone|iPad|iOS/.test(ua) ? "iOS" :
    /Windows/.test(ua) ? "Windows" :
    /Mac OS/.test(ua) ? "macOS" :
    /Linux/.test(ua) ? "Linux" :
    "Other";

  const q = new URLSearchParams(location.search);

  return {
    device,
    browser,
    os,
    screen: screen.width + "x" + screen.height,
    viewport: innerWidth + "x" + innerHeight,
    language: navigator.language || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    referrer: document.referrer || "direct",
    landingPath: location.pathname + location.hash,
    utmSource: q.get("utm_source") || "",
    utmMedium: q.get("utm_medium") || "",
    utmCampaign: q.get("utm_campaign") || ""
  };
}

/* ---------- state ---------- */
const state = { maxScroll: 0, sections: [], clicks: 0, eventCount: 0, activeSec: 0, dirty: false, enquiry: false };
const sessionRef = db ? doc(db, "sessions", sessionId) : null;
const safe = (p) => Promise.resolve(p).then((r) => { log("write OK"); return r; }).catch((e) => {
  console.error("[GES] Firestore write FAILED:", e && e.code, e && e.message);
  if (e && e.code === "permission-denied") console.error("[GES] → Rules are blocking the write. Publish firestore.rules (or temporary test rules).");
  if (e && (e.code === "not-found" || e.code === "failed-precondition")) console.error("[GES] → Create the Firestore database in the Firebase console (Build → Firestore Database).");
  if (e && e.code === "unavailable") console.error("[GES] → Network blocked. Disable ad-blocker/VPN or check connection.");
});

function scrollPct() {
  const max = document.documentElement.scrollHeight - innerHeight;
  return max > 0 ? Math.min(100, Math.round(scrollY / max * 100)) : 0;
}

/* ---------- session summary ---------- */
let created = false;
function flush(force) {
  if (!sessionRef || isBot) return;
  if (!created) {
    created = true;
    let isNew = true;
    try { isNew = !sessionStorage.getItem("ges_sess_created"); sessionStorage.setItem("ges_sess_created", "1"); } catch (e) {}
    if (isNew) {
      return safe(setDoc(sessionRef, {
        visitorId, startedAt: serverTimestamp(), lastActive: serverTimestamp(),
        ...deviceInfo(), maxScrollPct: 0, sectionsViewed: [], clickCount: 0, activeSeconds: 0, enquirySubmitted: false
      }, { merge: true }));
    }
  }
  if (!state.dirty && !force) return;
  state.dirty = false;
  return safe(setDoc(sessionRef, {
    lastActive: serverTimestamp(),
    maxScrollPct: state.maxScroll,
    sectionsViewed: state.sections,
    clickCount: state.clicks,
    activeSeconds: state.activeSec,
    enquirySubmitted: state.enquiry
  }, { merge: true }));
}

/* ---------- events ---------- */
function logEvent(type, label, extra) {
  if (!db || isBot || state.eventCount >= MAX_EVENTS_PER_SESSION) return;
  state.eventCount++; state.dirty = true;
  return safe(addDoc(collection(db, "sessions", sessionId, "events"), {
    type, label: label || "", ts: serverTimestamp(), scrollPct: scrollPct(), ...(extra || {})
  }));
}

/* ---------- enquiry (called from index.html sendEnquiry) ---------- */
async function saveEnquiry({
  name,
  phone,
  course,
  courseOption,
  state: preferredState,   // renamed so it doesn't clash with the tracker's own `state`
  stateOption,
  location: currentLocation,   // renamed so it doesn't clash with window.location
  heardFrom,
  heardFromDetail,
  source: legacySource,             // older index.html sent the answer as `source`
  sourceDetail: legacySourceDetail, // ...and `sourceDetail`
  message
}) {
  if (!db) {
    throw new Error("Firebase database is not initialized.");
  }

  try {
    const ref = await addDoc(collection(db, "enquiries"), {
      name: name.trim(),
      phone: phone.trim(),
      course,
      courseOption: courseOption || "",
      state: preferredState || "",
      stateOption: stateOption || "",
      location: (currentLocation || "").trim(),
      heardFrom: heardFrom || legacySource || "",
      heardFromDetail: (heardFromDetail || legacySourceDetail || "").trim(),
      message: message || "",
      status: "New",
      source: "Website",
      notes: "",
      createdAt: serverTimestamp(),
      sessionId,
      visitorId,
      device: deviceInfo().device,
      referrer: document.referrer || "direct"
    });

    state.enquiry = true;
    state.dirty = true;

    logEvent("form_submit", course);
    await flush(true);

    console.log("[GES] Enquiry successfully saved:", ref.id);

    return ref.id;
  } catch (error) {
    console.error("[GES] Enquiry save failed:", error);
    throw error;
  }
}

window.GES = { saveEnquiry, logEvent, sessionId, visitorId };

/* ---------- listeners ---------- */
if (!isBot && db) {
  flush();
  logEvent("page_view", location.pathname);

  // active time (only while tab is visible)
  setInterval(() => { if (document.visibilityState === "visible") { state.activeSec++; } }, 1000);
  setInterval(() => { state.dirty = true; flush(); }, FLUSH_EVERY_MS);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") { state.dirty = true; flush(true); } });
  addEventListener("pagehide", () => { state.dirty = true; flush(true); });

  // scroll depth (25/50/75/100)
  const marks = [25, 50, 75, 100], hit = new Set();
  let tick = false;
  addEventListener("scroll", () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const p = scrollPct();
      if (p > state.maxScroll) { state.maxScroll = p; state.dirty = true; }
      marks.forEach((m) => { if (p >= m && !hit.has(m)) { hit.add(m); logEvent("scroll_depth", m + "%"); } });
    });
  }, { passive: true });

  // section views
  if ("IntersectionObserver" in window) {
    const seen = new Set();
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && !seen.has(e.target.id)) {
        seen.add(e.target.id); state.sections = [...seen]; state.dirty = true;
        logEvent("section_view", e.target.id);
        io.unobserve(e.target);
      }
    }), { threshold: 0.35 });
    document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
  }

  // clicks
  document.addEventListener("click", (e) => {
    const el = e.target.closest("a,button");
    if (!el) return;
    const href = el.getAttribute("href") || "";
    const text = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
    let type = null, label = text;
    if (href.startsWith("tel:")) type = "call_click";
    else if (href.includes("wa.me")) type = "whatsapp_click";
    else if (el.classList.contains("chip-f")) { type = "course_filter"; label = el.dataset.f; }
    else if (el.dataset.course) { type = "course_enquire_click"; label = el.dataset.course; }
    else if (el.closest("#navlinks")) { type = "nav_click"; label = href; }
    else if (el.id === "menuToggle") type = "menu_toggle";
    else if (el.classList.contains("btn")) type = "cta_click";
    else if (el.id === "toTop") type = "back_to_top";
    if (!type) return;
    state.clicks++; state.dirty = true;
    logEvent(type, label);
  }, true);

  // form engagement (which fields people reach – shows drop-off; no typed content stored)
  const fields = new Set();
  document.addEventListener("focusin", (e) => {
    const f = e.target.closest && e.target.closest(".form-card");
    if (!f || !e.target.id) return;
    if (!fields.size) logEvent("form_start", e.target.id);
    if (!fields.has(e.target.id)) { fields.add(e.target.id); logEvent("form_field", e.target.id); }
  });
}




/* ---- Hero story + course-card stories (real stories only) ---- */
let STORY_LIST = [], heroTimer;
const clip = (t, n = 150) => t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t;
const heroBox = document.getElementById("heroStory");

function showHero(i) {
  const s = STORY_LIST[i]; if (!s) return;
  heroBox.classList.add("swap");
  setTimeout(() => {
    document.getElementById("hsStars").textContent = Number(s.rating) ? stars(s.rating) : "";
    document.getElementById("hsText").textContent = "“" + clip(s.story || s.text) + "”";
    document.getElementById("hsWho").textContent = "— " + s.name + [s.course, s.college].filter(Boolean).map(x => " · " + x).join("");
    heroBox.classList.remove("swap");
  }, 250);
}
function startHero() {
  clearInterval(heroTimer);
  heroBox.hidden = !STORY_LIST.length;
  if (!STORY_LIST.length) return;
  let i = 0; showHero(0);
  if (STORY_LIST.length > 1) heroTimer = setInterval(() => showHero(i = (i + 1) % STORY_LIST.length), 6000);
}

const toks = t => String(t || "").toLowerCase().split(/\s*(?:&|,|\/|\band\b)\s*/);
function courseStories() {
  document.querySelectorAll(".cc").forEach(card => {
    const q = card.querySelector(".cc-story"), title = (card.dataset.title || "").toLowerCase();
    const hit = STORY_LIST.find(s => s.course && (toks(title).includes(String(s.course).toLowerCase().trim()) || title.includes(String(s.course).toLowerCase().trim())));
    if (!hit) { q.hidden = true; return; }
    q.innerHTML = `“${esc(clip(hit.story || hit.text, 120))}”<cite>— ${esc(hit.name)}</cite>`;
    q.hidden = false;
  });
}
const _rc = window.renderCourses;                       // re-apply after admin-panel courses redraw
window.renderCourses = (l, r) => { _rc(l, r); courseStories(); };










const LIMIT = 400;
let reviews = [];            // set this to your loaded, active reviews

const esc = s => String(s ?? '').replace(/[&<>"']/g,
  c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const starStr = n => '★'.repeat(n) + '☆'.repeat(5 - n);

function cardHTML(r, i){
  const long = r.text.length > LIMIT;
  const shown = long ? r.text.slice(0, LIMIT).replace(/\s+\S*$/, '') + '…' : r.text;
  return `
    <article class="review-card">
      <div class="stars" aria-label="${r.rating} out of 5">${starStr(r.rating)}</div>
      <p>${esc(shown)}</p>
      ${long ? `<button type="button" class="read-more" data-i="${i}">Read more</button>` : ''}
      <strong>${esc(r.name)}</strong>
      ${r.location ? `<small>${esc(r.location)}</small>` : ''}
    </article>`;
}

// Open dialog from any "Read more" button
document.getElementById('reviewGrid').addEventListener('click', e => {
  const b = e.target.closest('.read-more');
  if (b) openReview(+b.dataset.i);
});

const dlg = document.getElementById('reviewDialog');
const track = document.getElementById('rdTrack');
const count = document.getElementById('rdCount');

function openReview(i){
  track.innerHTML = reviews.map(r => `
    <div class="rd-slide">
      <div class="stars">${starStr(r.rating)}</div>
      <p>${esc(r.text)}</p>
      <strong>${esc(r.name)}</strong>
      ${r.location ? `<br><small>${esc(r.location)}</small>` : ''}
    </div>`).join('');
  dlg.showModal();
  track.scrollTo({left: track.clientWidth * i, behavior: 'instant'});
  updateCount();
}

function current(){ return Math.round(track.scrollLeft / track.clientWidth); }
function updateCount(){ count.textContent = `${current() + 1} / ${reviews.length}`; }
function go(d){ track.scrollBy({left: d * track.clientWidth, behavior: 'smooth'}); }

track.addEventListener('scroll', updateCount);
document.getElementById('rdPrev').onclick = () => go(-1);
document.getElementById('rdNext').onclick = () => go(1);
dlg.querySelector('.rd-close').onclick = () => dlg.close();
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });  // click outside
dlg.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') go(-1);
  if (e.key === 'ArrowRight') go(1);
});


grid.addEventListener("click", e => {
  const b = e.target.closest(".read-more");
  if (!b) return;
  const cards = [...grid.querySelectorAll(".review-card")];
  rdTrack.innerHTML = cards.map(c => {
    const q = c.querySelector("blockquote");
    return `<div class="rd-slide">
      ${c.querySelector(".stars") ? `<div class="stars">${c.querySelector(".stars").textContent}</div>` : ""}
      ${c.querySelector(".story-tag") ? `<div class="story-tag">${c.querySelector(".story-tag").textContent}</div>` : ""}
      <blockquote>“${q.dataset.full}”</blockquote>
      <strong>${c.querySelector(".review-person strong").textContent}</strong>
      ${c.querySelector(".review-person small") ? `<small>${c.querySelector(".review-person small").textContent}</small>` : ""}
    </div>`;
  }).join("");
  dlg.showModal();
  rdTrack.scrollTo({ left: rdTrack.clientWidth * cards.indexOf(b.closest(".review-card")), behavior: "instant" });
  rdCount.textContent = (cards.indexOf(b.closest(".review-card")) + 1) + " / " + cards.length;
});