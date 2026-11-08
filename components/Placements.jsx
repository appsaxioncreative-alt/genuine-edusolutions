export default function Placements() {
  return (
    <section id="placements" className="pf-section">
      <style>{`
        .pf-section{background:#effaf6;padding:82px 0}
        .pf-wrap{width:min(1000px,calc(100% - 40px));margin:auto}
        .pf-head{text-align:center;max-width:690px;margin:0 auto 44px}
        .pf-kicker{display:inline-block;background:#dff5ee;color:#11a082;font-size:12px;font-weight:850;letter-spacing:1.8px;text-transform:uppercase;padding:5px 13px;border-radius:999px}
        .pf-head h2{font-size:clamp(29px,3.6vw,42px);line-height:1.15;letter-spacing:-1.2px;color:#0e4a42;margin:10px 0 13px}
        .pf-head p{color:#5f6b6a;margin:0}

        .pf-frame{position:relative;margin:0 auto;padding:10px;border-radius:34px;background:#fff;border:4px solid #19b896;box-shadow:0 0 0 4px #f0ae1e, 0 28px 60px rgba(15,61,58,.25)}
        .pf-frame:before{content:"";position:absolute;inset:-22px -22px 22px 22px;border:2px dashed #19b896;border-radius:40px;opacity:.35;z-index:-1}
        .pf-photo{position:relative;border-radius:24px;overflow:hidden;aspect-ratio:16/9}
        .pf-photo img{width:100%;height:100%;object-fit:cover;object-position:center 72%;display:block;transition:transform .6s}
        .pf-frame:hover .pf-photo img{transform:scale(1.04)}
        .pf-photo:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(10,46,43,.85) 0%,rgba(10,46,43,0) 45%)}
        .pf-cap{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:0 28px 22px;color:#fff;text-align:left}
        .pf-cap strong{display:inline-block;background:#f0ae1e;color:#3a2a00;font-size:12px;font-weight:850;letter-spacing:1px;text-transform:uppercase;padding:5px 12px;border-radius:999px;margin-bottom:8px}
        .pf-cap span{display:block;font-size:16px;font-weight:650}

        @media(max-width:850px){.pf-section{padding:64px 0}}
        @media(max-width:560px){
          .pf-section{padding:50px 0}
          .pf-frame{padding:6px;border-width:3px;border-radius:22px;box-shadow:0 0 0 3px #f0ae1e,0 18px 40px rgba(15,61,58,.22)}
          .pf-frame:before{display:none}
          .pf-photo{border-radius:16px;aspect-ratio:4/3}
          .pf-cap{padding:0 16px 14px}
          .pf-cap span{font-size:13px}
        }
      `}</style>

      <div className="pf-wrap">
        <div className="pf-head">
          <span className="pf-kicker">Our Alumni</span>
          <h2>Students who made it</h2>
          <p>Proud moments with the students who trained with us and went on to build their careers.</p>
        </div>

        <figure className="pf-frame">
          <div className="pf-photo">
            <img src="/placements/batch-2026.jpg" alt="Genuine Edu-Solutions placed students, Batch 2026" loading="lazy" />
            <figcaption className="pf-cap">
              <strong>Batch 2026</strong>
              <span>Our placed students with the Genuine Edu-Solutions team</span>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}