"use client";
import { useEffect, useRef, useState } from "react";
import { educationFallback } from "@/lib/fallback";

export default function SafeImage({ src, alt }) {
  const ref = useRef(null);
  const [state, setState] = useState("loading");

  // Handle images that finished (or failed) before React hydrated.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete) setState(el.naturalWidth > 0 ? "loaded" : "error");
  }, []);

  const cls = state === "loaded" ? "image-loaded" : state === "error" ? "image-fallback" : "";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={state === "error" ? educationFallback : src}
      alt={alt}
      className={cls}
      loading="lazy"
      referrerPolicy="no-referrer"
      onLoad={() => setState((s) => (s === "error" ? s : "loaded"))}
      onError={() => setState("error")}
    />
  );
}
