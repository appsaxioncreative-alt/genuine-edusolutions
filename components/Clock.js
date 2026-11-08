"use client";
import { useEffect, useState } from "react";

export default function Clock() {
  const [text, setText] = useState("--");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const small = innerWidth <= 560;
      const timeOpts = small
        ? { hour: "2-digit", minute: "2-digit" }
        : { hour: "2-digit", minute: "2-digit", second: "2-digit" };
      setText(
        d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) +
          " · " + d.toLocaleTimeString("en-IN", timeOpts)
      );
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return <span id="clock">{text}</span>;
}
