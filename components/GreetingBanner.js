"use client";
import Link from "next/link";
import Avatar from "./Avatar";
import { useAuth } from "@/context/AuthContext";

/* Home-page component: greets a logged-in user, invites a guest to log in */
export default function GreetingBanner() {
  const { user, loading, displayName, firstName, photoURL } = useAuth();
  if (loading) return <div className="welcome" style={{ minHeight: 34 }} />;

  return (
    <div className="welcome">
      <div className="container">
        {user ? (
          <div className="welcome-card">
            <Avatar name={displayName} photoURL={photoURL} size={54} />
            <div className="wc-text">
              <strong>Welcome back, {firstName}! 👋</strong>
              <span>Ready for the next step? Pick a course or keep your profile up to date.</span>
            </div>
            <div className="wc-actions">
              <Link className="btn btn-primary" href="/profile">View my profile</Link>
              <a className="btn btn-outline" href="#courses">Browse courses</a>
            </div>
          </div>
        ) : (
          <div className="welcome-card guest">
            <div className="wc-ico">🔑</div>
            <div className="wc-text">
              <strong>Hi there! Log in to save your details.</strong>
              <span>Create a free account to keep your profile and fill enquiries faster.</span>
            </div>
            <div className="wc-actions">
              <Link className="btn btn-primary" href="/login">Login</Link>
              <Link className="btn btn-outline" href="/login?mode=signup">Create account</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
