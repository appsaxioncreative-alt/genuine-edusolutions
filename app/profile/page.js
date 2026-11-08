"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/context/AuthContext";
import { authError } from "@/lib/authErrors";
import { COURSE_OPTIONS, QUALIFICATIONS } from "@/lib/courses";

const EMPTY = { name: "", phone: "", city: "", qualification: "", interest: "", about: "" };

const FIELDS = [
  ["Full name", "name"], ["Phone number", "phone"], ["City / District", "city"],
  ["Qualification", "qualification"], ["Course of interest", "interest"],
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading, displayName, photoURL, saveProfile, logOut, resetPassword } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [user, loading, router]);

  const current = { ...EMPTY, ...(profile || {}), name: displayName };

  const startEdit = () => { setForm({ ...current }); setError(""); setInfo(""); setEditing(true); };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSave(e) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      await saveProfile({
        name: form.name.trim(), phone: form.phone.trim(), city: form.city.trim(),
        qualification: form.qualification, interest: form.interest, about: form.about.trim(),
      });
      setEditing(false);
      setInfo("Profile updated.");
    } catch (err) { setError(authError(err)); }
    setBusy(false);
  }

  async function onReset() {
    setError(""); setInfo("");
    try { await resetPassword(user.email); setInfo("Password reset link sent to " + user.email + "."); }
    catch (err) { setError(authError(err)); }
  }

  async function onLogout() { await logOut(); router.replace("/"); }

  if (loading || !user) {
    return <main className="profile-page"><div className="auth-loading">Loading your profile…</div></main>;
  }

  const since = user.metadata && user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "";

  return (
    <main className="profile-page">
      <div className="container profile-grid">
        <aside className="panel profile-side">
          <Avatar name={displayName} photoURL={photoURL} size={96} />
          <h2>{displayName}</h2>
          <div className="mail">{user.email}</div>
          {since && <span className="profile-badge">Member since {since}</span>}
          <Link className="btn btn-primary" href="/#contact">Send an enquiry</Link>
          <Link className="btn btn-outline" href="/#courses">Browse courses</Link>
          <button type="button" className="btn btn-outline" onClick={onLogout}>Logout</button>
        </aside>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h1>My profile</h1>
              <p>{editing ? "Update your details below." : "Your details help us guide you faster."}</p>
            </div>
            {!editing && <button type="button" className="btn btn-primary" onClick={startEdit}>✎ Edit profile</button>}
          </div>

          {error && <div className="auth-msg err" role="alert">{error}</div>}
          {info && <div className="auth-msg ok">{info}</div>}

          {!editing ? (
            <>
              <dl className="detail-grid">
                {FIELDS.map(([label, key]) => (
                  <div className="detail" key={key}>
                    <dt>{label}</dt>
                    <dd className={current[key] ? "" : "empty"}>{current[key] || "Not added yet"}</dd>
                  </div>
                ))}
                <div className="detail"><dt>Email</dt><dd>{user.email}</dd></div>
                <div className="detail full"><dt>About / questions</dt><dd className={current.about ? "" : "empty"}>{current.about || "Not added yet"}</dd></div>
              </dl>
              <div style={{ marginTop: 26, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
                <button type="button" className="link-btn" onClick={onReset}>Send me a password reset email</button>
              </div>
            </>
          ) : (
            <form onSubmit={onSave}>
              <div className="form-grid">
                <div className="field"><label htmlFor="p-name">Full name</label><input id="p-name" required value={form.name} onChange={set("name")} autoComplete="name" /></div>
                <div className="field"><label htmlFor="p-email">Email</label><input id="p-email" value={user.email || ""} disabled /></div>
                <div className="field"><label htmlFor="p-phone">Phone number</label><input id="p-phone" type="tel" inputMode="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" /></div>
                <div className="field"><label htmlFor="p-city">City / District</label><input id="p-city" value={form.city} onChange={set("city")} /></div>
                <div className="field"><label htmlFor="p-qual">Qualification</label>
                  <select id="p-qual" value={form.qualification} onChange={set("qualification")}>
                    <option value="">Select qualification</option>
                    {QUALIFICATIONS.map((q) => <option key={q}>{q}</option>)}
                  </select></div>
                <div className="field"><label htmlFor="p-int">Course of interest</label>
                  <select id="p-int" value={form.interest} onChange={set("interest")}>
                    <option value="">Select a course</option>
                    {COURSE_OPTIONS.map((c) => <option key={c}>{c}</option>)}
                  </select></div>
                <div className="field full"><label htmlFor="p-about">About / questions</label>
                  <textarea id="p-about" value={form.about} onChange={set("about")} placeholder="Anything you'd like our team to know..." /></div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Saving..." : "Save changes"}</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)} disabled={busy}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
