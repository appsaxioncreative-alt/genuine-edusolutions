export default function Avatar({ name = "", photoURL = "", size = 40 }) {
  const initials =
    name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "U";
  return (
    <span className="avatar" style={{ "--s": size + "px", fontSize: Math.round(size * 0.38) }}>
      {photoURL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoURL} alt="" referrerPolicy="no-referrer" />
      ) : (
        initials
      )}
    </span>
  );
}
