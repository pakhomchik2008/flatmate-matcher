function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("");
}

function hashColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return `hsl(${hue} 60% 55%)`;
}

export default function Avatar({
  url,
  name,
  size = 48,
  className = "",
}: { url: string | null; name: string; size?: number; className?: string }) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white ${className}`}
      style={{ width: size, height: size, background: hashColor(name || "?"), fontSize: size * 0.4 }}
    >
      {initials(name || "?") || "?"}
    </div>
  );
}
