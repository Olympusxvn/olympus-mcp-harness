/**
 * Dark technical backdrop — not a World Cup stadium.
 * PROJECT.md: dark interface; luxury-wc-ui: light edge scrim only.
 */
export function HarnessBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 18% 0%, rgba(91, 141, 239, 0.14), transparent 55%), radial-gradient(ellipse 55% 45% at 78% 8%, rgba(155, 126, 245, 0.12), transparent 50%), radial-gradient(ellipse 50% 40% at 70% 92%, rgba(61, 204, 154, 0.08), transparent 50%), #07070b",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,215,0,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-obsidian/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian/90 to-transparent" />
    </div>
  );
}
