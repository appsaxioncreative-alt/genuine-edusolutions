"use client";
import {
  doc, setDoc, addDoc, collection, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const MAX_EVENTS_PER_SESSION = 150; // keeps Firestore writes (and cost) bounded
const FLUSH_EVERY_MS = 15000;       // how often the session summary is refreshed
const DEBUG = false;
const log = (...a) => { if (DEBUG) console.log("[GES]", ...a); };

const isBrowser = () => typeof window !== "undefined";
const isBot = () =>
  isBrowser() && (navigator.webdriver || /bot|crawl|spider|lighthouse/i.test(navigator.userAgent));

/* ---------- ids ---------- */
const uid = () =>
  crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
function stored(store, key) {
  try { let v = store.getItem(key); if (!v) { v = uid(); store.setItem(key, v); } return v; }
  catch (e) { return uid(); }
}
let _ids = null;
function ids() {
  if (!_ids) _ids = { visitorId: stored(localStorage, "ges_vid"), sessionId: stored(sessionStorage, "ges_sid") };
  return _ids;
}

/* ---------- device / source info ---------- */
function deviceInfo() {
  const ua = navigator.userAgent;
  const device = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|Android|iPhone/i.test(ua) ? "mobile" : "desktop";
  const browser =
    /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /SamsungBrowser/.test(ua) ? "Samsung Internet" :
    /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Other";
  const os =
    /Android/.test(ua) ? "Android" : /iPhone|iPad|iOS/.test(ua) ? "iOS" : /Windows/.test(ua) ? "Windows" :
    /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Other";
  const q = new URLSearchParams(location.search);
  return {
    device, browser, os,
    screen: screen.width + "x" + screen.height,
    viewport: innerWidth + "x" + innerHeight,
    language: navigator.language || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    referrer: document.referrer || "direct",
    landingPath: location.pathname + location.hash,
    utmSource: q.get("utm_source") || "",
    utmMedium: q.get("utm_medium") || "",
    utmCampaign: q.get("utm_campaign") || "",
  };
}

/* ---------- state ---------- */
const state = { maxScroll: 0, sections: [], clicks: 0, eventCount: 0, activeSec: 0, dirty: false, enquiry: false };
const sessionRef = () => doc(db, "sessions", ids().sessionId);

const safe = (p) =>
  Promise.resolve(p)
    .then((r) => { log("write OK"); return r; })
    .catch((e) => {
      console.error("[GES] Firestore write FAILED:", e && e.code, e && e.message);
      if (e && e.code === "permission-denied") console.error("[GES] → Rules are blocking the write. Publish firestore.rules.");
      if (e && (e.code === "not-found" || e.code === "failed-precondition")) console.error("[GES] → Create the Firestore database in the Firebase console.");
      if (e && e.code === "unavailable") console.error("[GES] → Network blocked. Disable ad-blocker/VPN or check connection.");
    });

function scrollPct() {
  const max = document.documentElement.scrollHeight - innerHeight;
  return max > 0 ? Math.min(100, Math.round((scrollY / max) * 100)) : 0;
}

/* ---------- session summary ---------- */
let created = false;
function flush(force) {
  if (!isBrowser() || isBot()) return;
  if (!created) {
    created = true;
    let isNew = true;
    try { isNew = !sessionStorage.getItem("ges_sess_created"); sessionStorage.setItem("ges_sess_created", "1"); } catch (e) {}
    if (isNew) {
      return safe(setDoc(sessionRef(), {
        visitorId: ids().visitorId, startedAt: serverTimestamp(), lastActive: serverTimestamp(),
        ...deviceInfo(), maxScrollPct: 0, sectionsViewed: [], clickCount: 0, activeSeconds: 0, enquirySubmitted: false,
      }, { merge: true }));
    }
  }
  if (!state.dirty && !force) return;
  state.dirty = false;
  return safe(setDoc(sessionRef(), {
    lastActive: serverTimestamp(),
    maxScrollPct: state.maxScroll,
    sectionsViewed: state.sections,
    clickCount: state.clicks,
    activeSeconds: state.activeSec,
    enquirySubmitted: state.enquiry,
  }, { merge: true }));
}

/* ---------- events ---------- */
export function logEvent(type, label, extra) {
  if (!isBrowser() || isBot() || state.eventCount >= MAX_EVENTS_PER_SESSION) return;
  state.eventCount++; state.dirty = true;
  return safe(addDoc(collection(db, "sessions", ids().sessionId, "events"), {
    type, label: label || "", ts: serverTimestamp(), scrollPct: scrollPct(), ...(extra || {}),
  }));
}

/* ---------- link the visit to a logged-in user ---------- */
export function linkUser(userId) {
  if (!isBrowser() || isBot() || !userId) return;
  safe(setDoc(sessionRef(), { userId }, { merge: true }));
}

/* ---------- enquiry ---------- */
export async function saveEnquiry({ name, phone, course, message, userId, email }) {
  if (!db) throw new Error("Firebase database is not initialized.");
  const { sessionId, visitorId } = ids();
  const ref = await addDoc(collection(db, "enquiries"), {
    name: name.trim(),
    phone: phone.trim(),
    course,
    message: message || "",
    status: "New",
    source: "Website",
    notes: "",
    createdAt: serverTimestamp(),
    sessionId,
    visitorId,
    userId: userId || "",
    email: email || "",
    device: deviceInfo().device,
    referrer: document.referrer || "direct",
  });
  state.enquiry = true; state.dirty = true;
  logEvent("form_submit", course);
  await flush(true);
  return ref.id;
}

/* ---------- section views (re-run on every route change) ---------- */
const seenSections = new Set();
let sectionObserver = null;
export function observeSections() {
  if (!isBrowser() || isBot() || !("IntersectionObserver" in window)) return;
  if (sectionObserver) sectionObserver.disconnect();
  sectionObserver = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting && !seenSections.has(e.target.id)) {
      seenSections.add(e.target.id);
      state.sections = [...seenSections]; state.dirty = true;
      logEvent("section_view", e.target.id);
      sectionObserver.unobserve(e.target);
    }
  }), { threshold: 0.35 });
  document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));
}

export function pageView(pathname) {
  if (!isBrowser() || isBot()) return;
  logEvent("page_view", pathname);
  observeSections();
}

/* ---------- global listeners (started once) ---------- */
let started = false;
export function startTracker() {
  if (started || !isBrowser() || isBot()) return;
  started = true;
  flush();

  setInterval(() => { if (document.visibilityState === "visible") state.activeSec++; }, 1000);
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

  // clicks
  document.addEventListener("click", (e) => {
    const el = e.target.closest && e.target.closest("a,button");
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
    else if (href === "/login") type = "login_click";
    else if (href === "/profile") type = "profile_click";
    else if (el.classList.contains("btn")) type = "cta_click";
    else if (el.id === "toTop") type = "back_to_top";
    if (!type) return;
    state.clicks++; state.dirty = true;
    logEvent(type, label);
  }, true);

  // form engagement (which fields people reach – no typed content stored)
  const fields = new Set();
  document.addEventListener("focusin", (e) => {
    const f = e.target.closest && e.target.closest(".form-card");
    if (!f || !e.target.id) return;
    if (!fields.size) logEvent("form_start", e.target.id);
    if (!fields.has(e.target.id)) { fields.add(e.target.id); logEvent("form_field", e.target.id); }
  });
}
