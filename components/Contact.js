"use client";
import { useEffect, useState } from "react";
import { saveEnquiry } from "@/lib/tracker";
import { COURSE_OPTIONS } from "@/lib/courses";
import { useAuth } from "@/context/AuthContext";

const WA = "918921296288";

export default function Contact() {
  const { user, profile, displayName } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState("Send enquiry on WhatsApp ↗");

  // prefill from the logged-in user's profile (only fills empty fields)
  useEffect(() => {
    if (!user) return;
    setName((n) => n || displayName || "");
    setPhone((p) => p || (profile && profile.phone) || "");
    setCourse((c) => c || (profile && profile.interest) || "");
  }, [user, profile, displayName]);

  // course chosen from a course card
  useEffect(() => {
    const on = (e) => setCourse(e.detail);
    window.addEventListener("ges:course", on);
    return () => window.removeEventListener("ges:course", on);
  }, []);

  const first = name.trim().split(" ")[0];

  async function onSubmit(e) {
    e.preventDefault();
    const n = name.trim(), p = phone.trim(), m = message.trim();
    if (!n || !p || !course) { alert("Please fill in all required fields."); return; }

    const text =
      `Hello Genuine Edu-Solutions!\n\nName: ${n}\nPhone: ${p}\nCourse: ${course}\n` +
      `Message: ${m || "I would like more information."}`;
    const url = `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

    setBusy(true);
    setLabel("Saving enquiry...");
    try {
      const id = await saveEnquiry({
        name: n, phone: p, course, message: m,
        userId: user ? user.uid : "", email: user ? user.email || "" : "",
      });
      if (!id) throw new Error("Enquiry was not saved.");
      setLabel("Enquiry saved! Opening WhatsApp...");
      window.location.href = url; // open WhatsApp after the database save succeeds
    } catch (err) {
      console.error("Enquiry submission error:", err);
      alert("We couldn't save your enquiry. Please try again.\n\n" + err.message);
      setBusy(false);
      setLabel("Try again");
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="container contact-grid">
        <div className="contact-info">
          <div className="kicker">Get in touch</div>
          <h2>Let’s talk about your future.</h2>
          <p>Contact us for course information, admission enquiries or to discuss the options available to you.</p>
          <div className="contact-row"><div className="ico">☎</div><div><strong>Phone / WhatsApp</strong><a href="tel:+918921296288">+91 89212 96288</a></div></div>
          <div className="contact-row"><div className="ico">✉</div><div><strong>Email</strong><a href="mailto:genuineedusolutions@gmail.com">genuineedusolutions@gmail.com</a></div></div>
          <div className="contact-row"><div className="ico">⌖</div><div><strong>Visit us</strong><a href="https://www.google.com/maps/search/?api=1&query=First+Floor%2C+S+S+Tower%2C+Near+Bus+Stand%2C+Kallara" target="_blank" rel="noopener">First Floor, S S Tower, Near Bus Stand, Kallara</a></div></div>
          <div className="contact-row"><div className="ico">◷</div><div><strong>Business hours</strong><span>Open 24 hours (as listed on the business profile)</span></div></div>
        </div>
        <form className="form-card" onSubmit={onSubmit}>
          <h3 id="formGreet">{first ? `Hi ${first}, send your admission enquiry` : "Send an admission enquiry"}</h3>
          <p>Fill in your details. Your enquiry will open in WhatsApp.</p>
          <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" placeholder="Enter your name" autoComplete="name" autoCapitalize="words" required value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Your contact number" required value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div className="field">
            <label htmlFor="course">Course of interest</label>
            <select id="course" name="course" required value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="">Select a course</option>
              {COURSE_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field"><label htmlFor="message">Your question (optional)</label><textarea id="message" name="message" placeholder="Tell us what you would like to know..." value={message} onChange={(e) => setMessage(e.target.value)} /></div>
          <button className="btn btn-primary" type="submit" disabled={busy}>{label}</button>
        </form>
      </div>
    </section>
  );
}
