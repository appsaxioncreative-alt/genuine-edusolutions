
import SafeImage from "./SafeImage";
import { AboutScene, StepIcon, StoryArt } from "./Illustrations";

export function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="container trust-grid">
        <div className="trust-item"><div className="trust-icon">◎</div><div><strong>Student-focused guidance</strong><small>Understand your options clearly</small></div></div>
        <div className="trust-item"><div className="trust-icon">⌖</div><div><strong>Kerala &amp; across India</strong><small>Explore opportunities in different locations</small></div></div>
        <div className="trust-item"><div className="trust-icon">✓</div><div><strong>Support through the process</strong><small>Get help with your admission enquiries</small></div></div>
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about">
      <div className="container about-grid">
       <div className="about-visual">
  <AboutScene />
</div>
        <div className="about-copy">
          <div className="kicker">About us</div>
          <h2>A clearer path from your ambition to admission.</h2>
          <p>Genuine Edu-Solutions is an educational consultancy based in Kallara, Kerala. We help students explore higher-education options and understand the admission process for a range of courses.</p>
          <p>Whether you are considering a healthcare, management or technology pathway, speak with our team to learn more about available options and the next steps.</p>
          <ul className="check-list">
            <li><b>✓</b> Information on a range of academic and professional courses</li>
            <li><b>✓</b> Guidance for colleges in Kerala and other parts of India</li>
            <li><b>✓</b> A friendly point of contact for your admission questions</li>
          </ul>
          <a className="btn btn-primary" href="#contact">Talk to our team <span>→</span></a>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  const steps = [
    ["STEP 01", "Tell us your goal", "Share the course you are interested in, your qualification and preferred study location."],
    ["STEP 02", "Explore your options", "Discuss relevant course and college options with our team."],
    ["STEP 03", "Understand the next steps", "Get information about the admission process and the details you may need to prepare."],
  ];
  return (
    <section id="process">
      <div className="container">
        <div className="section-head">
          <div className="kicker">Simple steps</div>
          <h2 className="section-title">How we can help you</h2>
          <p>Start a conversation with us and get clarity on what to do next.</p>
        </div>
        <div className="process-grid">
          {steps.map(([n, t, p]) => (
            <div className="step" key={n}><div className="step-num">{n}</div><h3>{t}</h3><p>{p}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Gallery() {
  const tiles = [
    ["photo-1523050854058-8df90110c9f1", "Students on a university campus", "Student counselling"],
    ["photo-1523580494863-6f3031224c94", "Students studying together", "Admission guidance"],
    ["photo-1522202176988-66273c2fd55f", "Students working together", "Student support"],
  ];
  return (
    <section id="gallery">
      <div className="container">
        <div className="section-head">
          <div className="kicker">A glimpse inside</div>
          <h2 className="section-title">Learning journeys begin with a conversation</h2>
          <p>A glimpse of the guidance and support offered by Genuine Edu-Solutions.</p>
        </div>
        <div className="gallery-grid">
          {tiles.map(([id, alt, label]) => (
            <div className="gallery-tile" key={id}>
              <SafeImage src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`} alt={alt} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Stories() {
  const stories = [
    ["photo-1517486808906-6ca8b3f04846", "Students discussing their studies", "Nursing pathway", "Anagha Nair", "Exploring nursing course options, understanding eligibility and preparing for the admission process."],
    ["photo-1434030216411-0b793f4b4173", "Student preparing study documents", "Course selection", "Adithyan Raj", "Comparing study pathways and learning what to consider before choosing a programme."],
    ["photo-1523240795612-9a054b0db644", "Students at a college campus", "Admission support", "Devika Menon", "Getting familiar with application steps and the documents that may be required for admission."],
  ];
  return (
    <section className="story-section" id="success-stories">
      <div className="container">
        <div className="section-head">
          <div className="kicker">Student journeys</div>
          <h2 className="section-title">Every future starts with a first step</h2>
          <p>Sample story layouts to show how genuine student experiences can be featured on the website.</p>
        </div>
        <div className="story-grid">
          {stories.map(([id, alt, tag, name, text]) => (
            <article className="story-card" key={name}>
              <SafeImage src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`} alt={alt} />
              <div className="story-content"><div className="story-tag">{tag}</div><h3>{name}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
        <p className="story-disclaimer"><strong>Note:</strong> Student names and profiles are illustrative examples for website layout. Replace them with verified student stories and approved photographs before publishing.</p>
      </div>
    </section>
  );
}

export function Reviews() {
  const reviews = [
    ["AS", "Anagha Nair", "Thiruvananthapuram, Kerala", "The guidance helped me understand the course options and the admission steps. The team was approachable and answered my questions clearly."],
    ["AK", "Adithyan Raj", "Kollam, Kerala", "I was looking for information about nursing studies. It was helpful to discuss the requirements and what I should check before applying."],
    ["MN", "Meera Suresh", "Kottayam, Kerala", "The admission enquiry process was simple. I could ask about different courses and get a clearer idea of the next steps."],
  ];
  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div className="section-head">
          <div className="kicker">Student voices</div>
          <h2 className="section-title">A little feedback from students</h2>
          <p>A few examples of the kind of feedback students may share about their guidance experience.</p>
        </div>
        <div className="rating-summary">
          <strong>5.0</strong>
          <div>
            <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
            <small>Illustrative rating</small>
          </div>
        </div>
        <div className="review-grid">
          {reviews.map(([ini, name, place, text]) => (
            <article className="review-card" key={name}>
              <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote>“{text}”</blockquote>
              <div className="review-person"><div className="review-avatar">{ini}</div><div><strong>{name}</strong><small>{place} · Sample profile</small></div></div>
            </article>
          ))}
        </div>
        <p className="demo-note"><strong>Note:</strong> The names, comments and rating are illustrative placeholders, not verified student reviews. Replace them with genuine feedback and student-approved names before publishing.</p>
      </div>
    </section>
  );
}

export function CtaPanel() {
  return (
   <div className="cta-dome">
  <div className="cta-text">
    <h2>Have a course in mind?</h2>
    <p>Speak with Genuine Edu-Solutions and take your next step with confidence.</p>
  </div>
  <a
    className="btn btn-light"
    href="https://wa.me/918921296288?text=Hello%2C%20I%20would%20like%20admission%20guidance."
    target="_blank"
    rel="noopener"
  >
    Message us on WhatsApp ↗
  </a>
</div>
  );
}
