"use client";
import { useRef, useState } from "react";
import { COURSES } from "@/lib/courses";

const FILTERS = [
  ["all", "All courses"], ["health", "🩺 Healthcare"], ["biz", "📈 Business"], ["tech", "💻 Technology"],
];

// Tells the enquiry form which course to preselect
const pickCourse = (course) => window.dispatchEvent(new CustomEvent("ges:course", { detail: course }));

export default function Courses() {
  const [filter, setFilter] = useState("all");
  const grid = useRef(null);

  return (
    <section className="courses" id="courses">
      <div className="container">
        <div className="section-head">
          <div className="kicker">Explore your options</div>
          <h2 className="section-title">Courses we can guide you on</h2>
          <p>Discover study pathways in healthcare, business, technology and other fields. Contact us for course-specific details and current admission information.</p>
        </div>
        <div className="chips" role="tablist" aria-label="Filter courses">
          {FILTERS.map(([f, label]) => (
            <button
              key={f} type="button" data-f={f}
              className={"chip-f" + (filter === f ? " active" : "")}
              onClick={(e) => {
                setFilter(f);
                if (grid.current) grid.current.scrollTo({ left: 0 });
                e.currentTarget.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
              }}
            >{label}</button>
          ))}
        </div>
        <div className="cc-grid" id="ccGrid" ref={grid}>
          {COURSES.map((c) => (
            <article
              key={c.title} data-cat={c.cat}
              className={"cc" + (filter !== "all" && c.cat !== filter ? " hide" : "")}
              style={{ "--a": c.a, "--b": c.b }}
            >
              <div className="art" dangerouslySetInnerHTML={{ __html: c.art + `<span class="tag">${c.tag}</span>` }} />
              <div className="cc-body">
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <div className="cc-links">
                  {c.links.map((l) => (
                    <a key={l.course} className="cc-link" href="#contact" data-course={l.course} onClick={() => pickCourse(l.course)}>
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="swipe-hint" aria-hidden="true">Swipe to see more <span>→</span></div>
        <div className="help-banner">
          <div className="hb-ico">🧭</div>
          <div className="hb-text"><strong>Not sure which course fits you?</strong><span>Share your qualification and interests and our team will help you explore the options.</span></div>
          <a className="btn btn-primary" href="#contact" data-course="Not sure yet" onClick={() => pickCourse("Not sure yet")}>Talk to an advisor →</a>
        </div>
      </div>
    </section>
  );
}
