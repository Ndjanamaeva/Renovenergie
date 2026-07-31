import { useEffect, useRef } from 'react';

type Piece = { x: number; y: number; vx: number; vy: number; rot: number; vrot: number; size: number; color: string; shape: 'rect' | 'circle' };
const COLORS = ['#10B981', '#1E3A8A', '#34d399', '#60a5fa', '#6ee7b7', '#93c5fd', '#059669'];

export function Confetti({ run }: { run: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!run) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const pieces: Piece[] = Array.from({ length: 160 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 3,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -16 - 4,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 8 + 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
        if (p.shape === 'rect') { ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6); }
        else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(rafRef.current); };
  }, [run]);

  if (!run) return null;
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" />;
}
