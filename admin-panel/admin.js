import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, orderBy, limit, onSnapshot, writeBatch, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cfg = {
  apiKey: "AIzaSyACJNjKWv97UGevG7NNTNEJTN4XxVQlV54",
  authDomain: "genuineedusolutions-5e2c2.firebaseapp.com",
  projectId: "genuineedusolutions-5e2c2",
  storageBucket: "genuineedusolutions-5e2c2.firebasestorage.app",
  messagingSenderId: "7797802437",
  appId: "1:7797802437:web:f72b54f67bf4a6e2e677ac"
};
const app = initializeApp(cfg), auth = getAuth(app), db = getFirestore(app);
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const dt = t => (t && t.toDate ? t.toDate() : null);
const fmt = d => d ? d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
const dur = s => s >= 60 ? Math.floor(s / 60) + "m " + (s % 60) + "s" : (s || 0) + "s";
const toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2800); };
const MSG = {
  "auth/invalid-credential": "Wrong email or password.",
  "auth/email-already-in-use": "That email already has an account. Sign in instead, or use a different email.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/operation-not-allowed": "Email/Password sign-in is off. In Firebase Console go to Authentication > Sign-in method and enable Email/Password.",
  "auth/network-request-failed": "Network problem. Check your connection and any ad-blocker, then try again.",
  "permission-denied": "Firestore blocked this. In Firebase Console go to Firestore > Rules, paste firestore.rules and click Publish.",
  "failed-precondition": "Firestore database is not created yet. In Firebase Console go to Firestore Database > Create database.",
  "not-found": "Firestore database is not created yet. In Firebase Console go to Firestore Database > Create database.",
  "unavailable": "Cannot reach Firebase. Check your connection or disable ad-blocker/VPN."
};
const msg = e => MSG[e.code] || e.message;
const STATUS = ["New", "Contacted", "Follow-up", "Admitted", "Closed"];

let mode = "login", busy = false, me = null, note = "", unsubs = [], enq = [], ses = [], adm = [];

/* ---------- auth screen ---------- */
function showAuth(m, err) {
  mode = m; $("#app").hidden = true; $("#auth").hidden = false;
  const s = m === "setup";
  $("#aTitle").textContent = s ? "Create the owner account" : "Admin sign in";
  $("#aSub").textContent = s ? "No admin exists yet. The first account you create becomes the owner." : "Genuine Edu-Solutions enquiry dashboard";
  $("#aNameWrap").hidden = !s; $("#aForgot").hidden = s;
  $("#aBtn").textContent = s ? "Create owner account" : "Sign in";
  $("#aPass").autocomplete = s ? "new-password" : "current-password";
  $("#aErr").textContent = err || note; note = "";
  $("#aSwitch").textContent = s ? "Already have an account? Sign in" : "First time here? Create the owner account";
}
$("#aSwitch").addEventListener("click", e => { e.preventDefault(); showAuth(mode === "setup" ? "login" : "setup"); });

async function route(user) {
  unsubs.forEach(u => u()); unsubs = []; me = null;
  if (!user) {
    try { const s = await getDoc(doc(db, "config", "setup")); showAuth(s.exists() ? "login" : "setup"); }
    catch (e) { showAuth("login", msg(e)); }
    return;
  }
  try {
    const a = await getDoc(doc(db, "admins", user.uid));
    if (!a.exists()) { note = "This account is not an admin. Ask an owner to add you."; await signOut(auth); return; }
    start(user, a.data());
  } catch (e) { note = msg(e); await signOut(auth); }
}
onAuthStateChanged(auth, u => { if (!busy) route(u); });

$("#authForm").addEventListener("submit", async e => {
  e.preventDefault();
  const email = $("#aEmail").value.trim().toLowerCase(), pass = $("#aPass").value, btn = $("#aBtn");
  btn.disabled = true; $("#aErr").textContent = "";
  try {
    if (mode === "setup") {
      busy = true;
      const c = await createUserWithEmailAndPassword(auth, email, pass);
      const b = writeBatch(db);
      b.set(doc(db, "admins", c.user.uid), { name: $("#aName").value.trim() || email, email, role: "owner", createdAt: serverTimestamp() });
      b.set(doc(db, "config", "setup"), { owner: email, createdAt: serverTimestamp() });
      await b.commit(); busy = false; route(c.user);
    } else await signInWithEmailAndPassword(auth, email, pass);
  } catch (x) { busy = false; $("#aErr").textContent = msg(x); }
  btn.disabled = false;
});
$("#aForgot").addEventListener("click", async e => {
  e.preventDefault();
  const email = $("#aEmail").value.trim();
  if (!email) return ($("#aErr").textContent = "Type your email first, then click Forgot password.");
  try { await sendPasswordResetEmail(auth, email); $("#aErr").textContent = "Reset link sent. Check your inbox."; } catch (x) { $("#aErr").textContent = msg(x); }
});
$("#out").addEventListener("click", () => signOut(auth));

/* ---------- app ---------- */
function start(user, data) {
  me = { uid: user.uid, ...data };
  $("#auth").hidden = true; $("#app").hidden = false;
  $("#who").textContent = (data.name || user.email) + " · " + data.role;
  const err = x => toast(msg(x));
  unsubs.push(onSnapshot(query(collection(db, "enquiries"), orderBy("createdAt", "desc")), s => { enq = s.docs.map(d => ({ id: d.id, ...d.data() })); renderAll(); }, err));
  unsubs.push(onSnapshot(query(collection(db, "sessions"), orderBy("startedAt", "desc"), limit(500)), s => { ses = s.docs.map(d => ({ id: d.id, ...d.data() })); renderAll(); }, err));
  unsubs.push(onSnapshot(collection(db, "admins"), s => { adm = s.docs.map(d => ({ id: d.id, ...d.data() })); renderAll(); }, err));
}
function renderAll() { overview(); enqList(); visits(); admins(); }

document.querySelectorAll(".tabs button").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".tabs button").forEach(x => x.classList.toggle("on", x === b));
  ["overview", "enq", "vis", "adm"].forEach(t => ($("#t-" + t).hidden = t !== b.dataset.tab));
}));

/* ---------- overview ---------- */
const bars = m => {
  const e = Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 7), mx = e[0] ? e[0][1] : 1;
  return e.length ? e.map(([k, v]) => `<div class="bar"><span title="${esc(k)}">${esc(k)}</span><i style="--w:${(v / mx) * 100}%"></i><b>${v}</b></div>`).join("") : '<p class="muted">No data yet.</p>';
};
const count = (arr, f) => { const m = {}; arr.forEach(x => [].concat(f(x)).forEach(k => { if (k) m[k] = (m[k] || 0) + 1; })); return m; };
const host = r => { if (!r || r === "direct") return "direct"; try { return new URL(r).hostname.replace(/^www\./, ""); } catch { return r; } };

function overview() {
  const now = Date.now(), n = ses.length;
  const week = enq.filter(e => { const d = dt(e.createdAt); return d && now - d < 6048e5; }).length;
  const avg = k => (n ? Math.round(ses.reduce((a, s) => a + (s[k] || 0), 0) / n) : 0);
  const rate = n ? ((100 * ses.filter(s => s.enquirySubmitted).length) / n).toFixed(1) : "0";
  const stats = [["Enquiries", enq.length], ["New", enq.filter(e => (e.status || "New") === "New").length], ["Last 7 days", week], ["Visits", n], ["Unique visitors", new Set(ses.map(s => s.visitorId)).size], ["Avg scroll depth", avg("maxScrollPct") + "%"], ["Avg time on page", dur(avg("activeSeconds"))], ["Visit → enquiry", rate + "%"]];
  $("#stats").innerHTML = stats.map(([k, v]) => `<div class="stat"><b>${v}</b><span>${k}</span></div>`).join("");
  $("#bCourse").innerHTML = bars(count(enq, e => e.course));
  $("#bState").innerHTML = bars(count(enq, e => e.state));
  $("#bSec").innerHTML = bars(count(ses, s => s.sectionsViewed || []));
  $("#bDev").innerHTML = bars(count(ses, s => s.device));
  $("#bSrc").innerHTML = bars(count(ses, s => s.utmSource || host(s.referrer)));
}

/* ---------- enquiries ---------- */
function enqList() {
  const q = $("#q").value.toLowerCase(), st = $("#fs").value, fc = $("#fc"), cur = fc.value;
  fc.innerHTML = '<option value="">All courses</option>' + [...new Set(enq.map(e => e.course).filter(Boolean))].map(c => `<option ${c === cur ? "selected" : ""}>${esc(c)}</option>`).join("");
  const rows = enq.filter(e => (!st || (e.status || "New") === st) && (!fc.value || e.course === fc.value) && (!q || [e.name, e.phone, e.course, e.state, e.message].join(" ").toLowerCase().includes(q)));
  $("#enqCount").textContent = rows.length + " of " + enq.length;
  $("#enqBody").innerHTML = rows.map(e => {
    const digits = String(e.phone || "").replace(/\D/g, ""), wa = digits.length === 10 ? "91" + digits : digits;
    return `<tr><td>${fmt(dt(e.createdAt))}</td>
<td><b>${esc(e.name)}</b><br><a href="tel:${esc(e.phone)}">${esc(e.phone)}</a> · <a target="_blank" rel="noopener" href="https://wa.me/${wa}">WhatsApp</a></td>
<td>${esc(e.course)}</td><td>${esc(e.state || "—")}</td>
<td class="msg">${esc(e.message)}${e.notes ? `<br><em>Note: ${esc(e.notes)}</em>` : ""}</td>
<td><select data-act="status" data-id="${e.id}">${STATUS.map(s => `<option ${s === (e.status || "New") ? "selected" : ""}>${s}</option>`).join("")}</select></td>
<td class="act"><button data-act="note" data-id="${e.id}">Note</button><button class="danger" data-act="del" data-id="${e.id}">Delete</button></td></tr>`;
  }).join("") || '<tr><td colspan="7" class="muted">No enquiries found.</td></tr>';
}
["q", "fs", "fc"].forEach(id => $("#" + id).addEventListener("input", enqList));

/* ---------- visitors ---------- */
function visits() {
  $("#visBody").innerHTML = ses.slice(0, 200).map(s => {
    const p = s.maxScrollPct || 0, secs = s.sectionsViewed || [];
    return `<tr><td>${fmt(dt(s.startedAt))}</td><td>${esc(s.device)} · ${esc(s.browser)} · ${esc(s.os)}</td><td>${esc(s.utmSource || host(s.referrer))}</td>
<td><span class="meter"><i style="width:${p}%"></i></span>${p}%</td><td>${dur(s.activeSeconds)}</td><td title="${esc(secs.join(", "))}">${secs.length}</td><td>${s.clickCount || 0}</td><td>${s.enquirySubmitted ? "Yes" : ""}</td></tr>`;
  }).join("") || '<tr><td colspan="8" class="muted">No visits recorded yet.</td></tr>';
}

/* ---------- admins ---------- */
function admins() {
  $("#admList").innerHTML = adm.map(a => `<div class="row"><div><b>${esc(a.name)}</b><small>${esc(a.email)} · ${esc(a.role)}</small></div>${a.id !== me.uid && a.role !== "owner" ? `<button class="ghost" data-act="rmadmin" data-id="${a.id}">Remove</button>` : ""}</div>`).join("");
}
$("#admForm").addEventListener("submit", async e => {
  e.preventDefault();
  const name = $("#nName").value.trim(), email = $("#nEmail").value.trim().toLowerCase(), pass = $("#nPass").value;
  try {
    // A second app instance creates the account without signing you out.
    const sec = initializeApp(cfg, "sec" + Date.now()), sa = getAuth(sec);
    const c = await createUserWithEmailAndPassword(sa, email, pass);
    await signOut(sa);
    await setDoc(doc(db, "admins", c.user.uid), { name, email, role: "admin", addedBy: me.email || "", createdAt: serverTimestamp() });
    e.target.reset(); toast("Admin added");
  } catch (x) { toast(msg(x)); }
});

/* ---------- row actions ---------- */
document.addEventListener("change", async e => {
  const t = e.target;
  if (t.dataset.act !== "status") return;
  try { await updateDoc(doc(db, "enquiries", t.dataset.id), { status: t.value }); toast("Status updated"); } catch (x) { toast(msg(x)); }
});
document.addEventListener("click", async e => {
  const t = e.target.closest("button[data-act]");
  if (!t) return;
  const id = t.dataset.id;
  try {
    if (t.dataset.act === "del" && confirm("Delete this enquiry permanently?")) { await deleteDoc(doc(db, "enquiries", id)); toast("Enquiry deleted"); }
    if (t.dataset.act === "note") {
      const cur = enq.find(x => x.id === id), n = prompt("Notes for this enquiry:", (cur && cur.notes) || "");
      if (n !== null) { await updateDoc(doc(db, "enquiries", id), { notes: n.trim() }); toast("Note saved"); }
    }
    if (t.dataset.act === "rmadmin" && confirm("Remove this admin's access?")) { await deleteDoc(doc(db, "admins", id)); toast("Admin removed"); }
  } catch (x) { toast(msg(x)); }
});
