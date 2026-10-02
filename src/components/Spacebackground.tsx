import { useEffect, useRef } from 'react';

type RGB = [number, number, number];

/**
 * One fixed canvas for the whole page (not one per section).
 * ~30fps, DPR capped, ≤160 stars, only draws in dark mode, and the browser
 * pauses rAF when the tab is hidden. `tint` eases the star colour per section.
 */
export default function SpaceBackground({ tint }: { tint: RGB }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const tintRef = useRef(tint);
  tintRef.current = tint;

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, last = 0;
    let stars: { x: number; y: number; z: number; p: number }[] = [];
    const col: RGB = [...tintRef.current];

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(160, (w * h) / 9000));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h, z: Math.random(), p: Math.random() * 6.28,
      }));
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 33) return; // ~30fps cap
      last = t;
      ctx.clearRect(0, 0, w, h);
      if (!document.documentElement.classList.contains('dark')) return;

      const tg = tintRef.current;
      for (let i = 0; i < 3; i++) col[i] += (tg[i] - col[i]) * 0.06;
      const rgb = `${(255 + col[0]) >> 1},${(255 + col[1]) >> 1},${(255 + col[2]) >> 1}`;
      const sy = reduce ? 0 : window.scrollY;

      for (const s of stars) {
        const y = (((s.y - sy * (0.04 + s.z * 0.18)) % h) + h) % h;
        const twinkle = reduce ? 1 : 0.6 + 0.4 * Math.sin(t * 0.001 * (0.5 + s.z) + s.p);
        ctx.fillStyle = `rgba(${rgb},${(0.25 + s.z * 0.65) * twinkle})`;
        const r = 0.6 + s.z * 1.2;
        ctx.fillRect(s.x, y, r, r);
      }
    };

    const onResize = () => { if (window.innerWidth !== w) size(); }; // ignore mobile URL-bar resizes
    size();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="galaxy" />
      <canvas ref={ref} className="h-full w-full" />
    </div>
  );
}