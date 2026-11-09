"use client";
import Link from "next/link";
import Clock from "./Clock";
import { useAuth } from "@/context/AuthContext";

export default function TopBar() {
  const { user, loading, firstName, logOut } = useAuth();
  return (
    <div className="topbar">
      <div className="container">
        <span className="tb-a">Genuine Edu-Solutions <span style={{ opacity: 0.55 }}>•</span> Kallara, Kerala</span>
        <span className="tb-b">Admission guidance for courses across Kerala &amp; India</span>
        <span className="live">
          <i className="pulse"></i><b>Open now</b> <span className="sep">•</span> <Clock />
        </span>
        <span className="tb-auth">
          {loading ? null : user ? (
            <>
              <Link href="/profile">Hi, {firstName} 👋</Link>
              <span className="tb-sep">|</span>
              <button type="button" className="tb-logout" onClick={logOut}>Logout</button>
            </>
          ) : (
            <Link href="/login">Login / Sign up</Link>
          )}
        </span>
      </div>
    </div>
  );
}
