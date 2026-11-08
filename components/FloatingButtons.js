import Link from "next/link";

export default function FloatingButtons() {
  return (
    <>
      <nav className="mbar" aria-label="Quick contact">
        <a href="tel:+918921296288"><span>📞</span>Call</a>
        <a className="mb-wa" href="https://wa.me/918921296288?text=Hello%20Genuine%20Edu-Solutions%2C%20I%20would%20like%20admission%20guidance." target="_blank" rel="noopener"><span>💬</span>WhatsApp</a>
        <Link className="mb-enq" href="/#contact"><span>✉</span>Enquire</Link>
      </nav>
      <a className="wa-float" href="https://wa.me/918921296288" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">✆</a>
    </>
  );
}
