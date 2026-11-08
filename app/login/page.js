"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authError } from "@/lib/authErrors";

/* ---------- debug logging (open browser DevTools → Console, filter by "[LOGIN]") ---------- */
const DEBUG = true; // set to false once everything works
const log = (...a) => { if (DEBUG) console.log("[LOGIN]", ...a); };
function logErr(step, err) {
  if (!DEBUG) return;
  console.groupCollapsed("[LOGIN] ❌ " + step + " failed → " + (err && err.code ? err.code : "no-code"));
  console.error("code   :", err && err.code);
  console.error("message:", err && err.message);
  if (err && err.customData) console.error("customData:", err.customData);
  console.error("full error object:", err);
  const hints = {
    "auth/configuration-not-found": "Firebase console → Build → Authentication → Get started.",
    "auth/operation-not-allowed": "Enable this provider under Authentication → Sign-in method.",
    "auth/unauthorized-domain": "Add this domain under Authentication → Settings → Authorized domains.",
    "auth/invalid-api-key": "Check NEXT_PUBLIC_FIREBASE_API_KEY in .env.local, then restart `npm run dev`.",
    "auth/api-key-not-valid.-please-pass-a-valid-api-key.": "API key is wrong/restricted. Check .env.local and Google Cloud → Credentials.",
    "auth/network-request-failed": "Network/ad-blocker/VPN is blocking Firebase requests.",
    "auth/invalid-credential": "Wrong email/password (or the account doesn't exist yet).",
    "auth/email-already-in-use": "Account exists – use the Login tab.",
    "auth/weak-password": "Password must be 6+ characters.",
    "auth/popup-blocked": "Browser blocked the Google popup – allow popups for this site.",
    "permission-denied": "Firestore rules are blocking the write – publish firestore.rules.",
  };
  if (err && hints[err.code]) console.warn("💡 Hint:", hints[err.code]);
  console.groupEnd();
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading, logIn, signUp, googleSignIn, resetPassword } = useAuth();

  const [mode, setMode] = useState(params.get("mode") === "signup" ? "signup" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // log Firebase config presence once (never prints the full key)
  useEffect(() => {
    const k = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    log("page loaded. env check:", {
      apiKey: k ? k.slice(0, 6) + "…(" + k.length + " chars)" : "MISSING ❌",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "MISSING ❌",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "MISSING ❌",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "set" : "MISSING ❌",
      origin: location.origin,
    });
  }, []);

  useEffect(() => { log("auth state →", loading ? "loading…" : user ? "logged in as " + user.email + " (" + user.uid + ")" : "logged out"); }, [user, loading]);

  // already logged in → go to profile
  useEffect(() => {
    if (!loading && user) { log("already logged in → redirecting to /profile"); router.replace("/profile"); }
  }, [user, loading, router]);

  const switchMode = (m) => { log("mode →", m); setMode(m); setError(""); setInfo(""); };

  async function onSubmit(e) {
    e.preventDefault();
    setError(""); setInfo(""); setBusy(true);
    log("submit →", mode, { email: email.trim() });
    try {
      if (mode === "signup") {
        const u = await signUp({ name: name.trim(), email: email.trim(), password, phone: phone.trim() });
        log("✅ sign-up OK", u && u.uid);
      } else if (mode === "login") {
        const u = await logIn(email.trim(), password);
        log("✅ login OK", u && u.user && u.user.uid);
      } else {
        await resetPassword(email.trim());
        log("✅ reset email sent to", email.trim());
        setInfo("Reset link sent. Check your inbox (and spam folder).");
        setBusy(false);
        return;
      }
      log("redirecting to /profile");
      router.replace("/profile");
    } catch (err) {
      logErr(mode, err);
      setError(errText(err));
      setBusy(false);
    }
  }

  async function onGoogle() {
    setError(""); setInfo(""); setBusy(true);
    log("google sign-in → opening popup");
    try {
      const u = await googleSignIn();
      log("✅ google sign-in OK", u && u.email);
      router.replace("/profile");
    } catch (err) {
      logErr("google sign-in", err);
      setError(errText(err));
      setBusy(false);
    }
  }

  // while DEBUG is on, also show the raw Firebase code in the red box
  const errText = (err) => authError(err) + (DEBUG && err && err.code ? "  [" + err.code + "]" : "");

  const title = mode === "signup" ? "Create your account" : mode === "reset" ? "Reset your password" : "Welcome back";
  const sub =
    mode === "signup" ? "Save your details and send enquiries faster."
    : mode === "reset" ? "Enter your email and we'll send you a reset link."
    : "Log in to view and edit your profile.";

  return (
    <main className="auth-page">
      <div className="container">
        <div className="auth-wrap">
          <div className="auth-card">
            {mode !== "reset" && (
              <div className="auth-tabs" role="tablist">
                <button type="button" className={mode === "login" ? "on" : ""} onClick={() => switchMode("login")}>Login</button>
                <button type="button" className={mode === "signup" ? "on" : ""} onClick={() => switchMode("signup")}>Sign up</button>
              </div>
            )}
            <h1>{title}</h1>
            <p className="sub">{sub}</p>

            {error && <div className="auth-msg err" role="alert">{error}</div>}
            {info && <div className="auth-msg ok">{info}</div>}

            <form onSubmit={onSubmit}>
              {mode === "signup" && (
                <div className="field"><label htmlFor="a-name">Full name</label>
                  <input id="a-name" placeholder="Enter your name" autoComplete="name" autoCapitalize="words" required value={name} onChange={(e) => setName(e.target.value)} /></div>
              )}
              <div className="field"><label htmlFor="a-email">Email</label>
                <input id="a-email" type="email" placeholder="you@example.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              {mode === "signup" && (
                <div className="field"><label htmlFor="a-phone">Phone number (optional)</label>
                  <input id="a-phone" type="tel" inputMode="tel" placeholder="Your contact number" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
              )}
              {mode !== "reset" && (
                <div className="field"><label htmlFor="a-pw">Password</label>
                  <div className="pw-wrap">
                    <input id="a-pw" type={showPw ? "text" : "password"} placeholder={mode === "signup" ? "At least 6 characters" : "Your password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowPw((s) => !s)}>{showPw ? "Hide" : "Show"}</button>
                  </div></div>
              )}
              <button className="btn btn-primary" type="submit" disabled={busy}>
                {busy ? "Please wait..." : mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Login"}
              </button>
            </form>

          

            <div className="auth-links">
              {mode === "login" && <button type="button" className="link-btn" onClick={() => switchMode("reset")}>Forgot password?</button>}
              {mode === "reset" && <button type="button" className="link-btn" onClick={() => switchMode("login")}>← Back to login</button>}
              <Link href="/" className="link-btn" style={{ marginLeft: "auto" }}>Back to website</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="auth-page"><div className="auth-loading">Loading…</div></main>}>
      <LoginForm />
    </Suspense>
  );
}