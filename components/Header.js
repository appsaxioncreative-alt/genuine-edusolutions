"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Avatar from "./Avatar";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading, displayName, photoURL } = useAuth();

  useEffect(() => {
    const onDoc = (e) => {
      if (!e.target.closest("#navlinks") && !e.target.closest("#menuToggle")) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    const onResize = () => { if (innerWidth > 850) setOpen(false); };
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
      removeEventListener("resize", onResize);
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <header>
      <div className="container nav">
        <Link className="brand" href="/#home" aria-label="Genuine Edu-Solutions home">
<img
  src="/icon.png"
  alt="Genuine Edu-Solutions logo"
  className="brand-mark"
/>        
        </Link>
        <nav className={"navlinks" + (open ? " open" : "")} id="navlinks" onClick={(e) => { if (e.target.closest("a")) close(); }}>
          <Link href="/#home">Home</Link>
          <Link href="/#about">About</Link>
          <Link href="/#courses">Courses</Link>
          <Link href="/#process">How It Works</Link>
          <Link href="/#gallery">Gallery</Link>
          <Link href="/#success-stories">Success Stories</Link>
          <Link href="/#reviews">Reviews</Link>
          <Link href="/#contact">Contact</Link>
          <Link className="btn btn-primary nav-cta" href="/#contact">Speak to an Advisor <span>↗</span></Link>
        </nav>
        <Link className="btn btn-primary" href="/#contact">Speak to an Advisor <span>↗</span></Link>
        <div className="nav-actions">
          {!loading && (user ? (
            <Link className="nav-user" href="/profile" aria-label="My profile">
              <Avatar name={displayName} photoURL={photoURL} size={34} />
              <span className="nav-uname">{displayName}</span>
            </Link>
          ) : (
            <Link className="nav-login" href="/login">Login</Link>
          ))}
          <button
            className="menu-toggle" id="menuToggle" type="button" aria-label="Toggle menu"
            aria-controls="navlinks" aria-expanded={open}
            onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
