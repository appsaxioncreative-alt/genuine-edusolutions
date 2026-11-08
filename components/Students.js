function Student({ d, bubble, shirt, skin, hair, cap, long }) {
  return (
    <div className="stu" style={{ "--d": d }}>
      <div className="bubble">{bubble}</div>
      <svg viewBox="0 0 124 150" role="img" aria-label="Waving student">
        <g className="bob">
          <ellipse cx="62" cy="146" rx="34" ry="4" fill="rgba(0,0,0,.18)" />
          <path d="M26 144c0-30 14-48 36-48s36 18 36 48z" fill={shirt} />
          <rect x="55" y="82" width="14" height="16" rx="6" fill={skin} />
          <circle cx="62" cy="58" r="26" fill={skin} />
          <path d="M36 52c0-20 12-30 26-30s26 10 26 30c-6-10-14-14-26-14s-20 4-26 14z" fill={hair} />
          {long && <path d="M34 50c-4 18 0 32 6 40M90 50c4 18 0 32-6 40" stroke={hair} strokeWidth="9" fill="none" strokeLinecap="round" />}
          <g className="eyes"><circle cx="53" cy="60" r="3" fill="#1f1e3a" /><circle cx="71" cy="60" r="3" fill="#1f1e3a" /></g>
          <path d="M54 70q8 8 16 0" stroke="#1f1e3a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <circle cx="46" cy="68" r="4" fill="#ff8a8a" opacity=".35" /><circle cx="78" cy="68" r="4" fill="#ff8a8a" opacity=".35" />
          {cap && (
            <>
              <path d="M30 36l32-14 32 14-32 14z" fill="#1b1a4e" />
              <rect x="48" y="40" width="28" height="9" rx="3" fill="#1b1a4e" />
              <path d="M94 36v16" stroke="#ffb84d" strokeWidth="3" />
              <circle cx="94" cy="54" r="3.5" fill="#ffb84d" />
            </>
          )}
          <path d="M34 104c-4 8-6 16-6 26" stroke={shirt} strokeWidth="13" strokeLinecap="round" fill="none" />
          <g className="arm">
            <path d="M90 106L104 66" stroke={shirt} strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="105" cy="60" r="9" fill={skin} />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function Students() {
  return (
    <div className="students" aria-hidden="true">
      <Student d="0s" bubble="Hi! 👋" shirt="#ffb84d" skin="#f2c9a0" hair="#2b1d17" />
      <Student d="0.5s" bubble="നമസ്കാരം!" shirt="#e0562a" skin="#c68a5c" hair="#1b1209" cap />
      <Student d="1s" bubble="Hello! 👋" shirt="#8a6cf5" skin="#e8b98d" hair="#3a2418" long />
    </div>
  );
}
