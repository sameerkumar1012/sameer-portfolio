"use client";

/**
 * Stateless on purpose.
 *
 * The theme already lives on <html data-theme>, applied before first paint by
 * the inline script in layout.tsx. Mirroring it into React state would mean
 * reading the DOM in an effect, which costs a cascading render and risks a
 * hydration mismatch. The icons are swapped by CSS instead, and the click
 * handler reads the current value straight off the element.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode — the choice just won't persist */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      className="grid w-7 h-7 place-items-center text-[var(--text-accent-soft)] hover:text-[var(--neon-pink)] transition-colors"
    >
      <MoonIcon />
      <SunIcon />
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      className="theme-icon-sun col-start-1 row-start-1"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="theme-icon-moon col-start-1 row-start-1"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}
