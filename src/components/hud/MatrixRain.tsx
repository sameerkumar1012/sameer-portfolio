/**
 * Ambient resume text behind the reactor.
 *
 * Purely decorative — the circular hole in the middle is punched by a radial
 * mask in `.matrix-rain`, so this component just emits the text. Server
 * rendered, hidden from assistive tech.
 */
export function MatrixRain({ fragments }: { fragments: string[] }) {
  if (fragments.length === 0) return null;

  return (
    <div className="matrix-rain" aria-hidden>
      {fragments.join("  ·  ")}
    </div>
  );
}
