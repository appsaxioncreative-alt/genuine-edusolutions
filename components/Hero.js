"use client";
import { useEffect, useState } from "react";
import Students from "./Students";
import { useAuth } from "@/context/AuthContext";

const WORDS = ["right education.", "right course.", "right college.", "right guidance."];

export default function Hero() {
  const { user, firstName } = useAuth();
  const [greeting, setGreeting] = useState("Welcome");
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 5 ? "Hello, night owl" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : h < 21 ? "Good evening" : "Good night");
  }, []);

  useEffect(() => {
    let t2;
    const t = setInterval(() => {
      setOut(true);
      t2 = setTimeout(() => { setI((n) => (n + 1) % WORDS.length); setOut(false); }, 350);
    }, 2800);
    return () => { clearInterval(t); clearTimeout(t2); };
  }, []);

  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div>
          <div className="eyebrow">
            <i></i> <span id="greet">{greeting}{user && firstName ? `, ${firstName}` : ""}</span> <span className="wave">👋</span> · Your trusted education partner
          </div>
          <h1>Build your future with the <span id="rot" className={"rot" + (out ? " out" : "")}>{WORDS[i]}</span></h1>
          <p>Explore course opportunities and get guidance for admissions to colleges in Kerala and across India. Your next step starts with the right information.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">Get Admission Guidance <span>→</span></a>
            <a className="btn btn-light" href="https://wa.me/918921296288?text=Hello%20Genuine%20Edu-Solutions%2C%20I%20would%20like%20to%20know%20about%20admissions." target="_blank" rel="noopener">Chat on WhatsApp</a>
          </div>
          <div className="hero-note">Personal guidance • Course information • Admission support</div>
        </div>
        <Students />
        <aside className="hero-card">
          <div className="cap">Find your direction</div>
          <h2>Explore pathways across popular study fields.</h2>
          <div className="course-pills">
            <span>BSc Nursing</span><span>GNM</span><span>BBA</span><span>BCA</span><span>BOT</span><span>BPT</span><span>UG &amp; PG</span><span>And more</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
