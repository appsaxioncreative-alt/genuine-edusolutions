"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/* Progress bar, back-to-top button, active nav link, scroll-reveal */
export default function ScrollUI() {
  const pathname = usePathname();
  const bar = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
      setShow(scrollY > 600);

      const links = [...document.querySelectorAll('#navlinks a[href^="/#"]:not(.nav-cta)')];
      if (pathname !== "/") { links.forEach((a) => a.classList.remove("active")); return; }
      let cur = 0;
      links.forEach((a, k) => {
        const el = document.querySelector(a.getAttribute("href").slice(1));
        if (el && el.getBoundingClientRect().top < 140) cur = k;
      });
      links.forEach((a, k) => a.classList.toggle("active", k === cur));
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => removeEventListener("scroll", onScroll);
  }, [pathname]);

  // scroll-reveal (course cards are excluded so the filter chips can't fight with it)
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const isPhone = innerWidth <= 560;
    const targets = document.querySelectorAll(
      ".section-head,.step,.gallery-tile,.story-card,.review-card,.about-grid>*,.contact-grid>*,.cta-panel"
    );
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.08 });
    targets.forEach((el, k) => {
      if (el.classList.contains("reveal")) return;
      el.classList.add("reveal");
      el.style.transitionDelay = (isPhone ? 0 : (k % 3) * 90) + "ms";
      io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  return (
    <>
      <div id="progress" ref={bar}></div>
      <button
        className={"to-top" + (show ? " show" : "")} id="toTop" aria-label="Back to top"
        onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
      >↑</button>
    </>
  );
}
