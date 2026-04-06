'use client';

import { useEffect, useRef, useCallback } from 'react';

interface InkDot {
  x: number;
  y: number;
  size: number;
  opacity: number;
  birth: number;
}

export default function GoldInkTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useRef<InkDot[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const prevMousePos = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);
  const isMobile = useRef(false);

  const addDots = useCallback((x: number, y: number) => {
    const dx = x - prevMousePos.current.x;
    const dy = y - prevMousePos.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    // Only add dots when moving, scale density with speed
    if (speed > 2) {
      const count = Math.min(Math.floor(speed / 8), 4);
      for (let i = 0; i < count; i++) {
        const t = i / count;
        dots.current.push({
          x: prevMousePos.current.x + dx * t + (Math.random() - 0.5) * 6,
          y: prevMousePos.current.y + dy * t + (Math.random() - 0.5) * 6,
          size: 2 + Math.random() * 3 + Math.min(speed * 0.03, 2),
          opacity: 0.35 + Math.random() * 0.25,
          birth: Date.now(),
        });
      }
    }

    prevMousePos.current = { x, y };
  }, []);

  useEffect(() => {
    isMobile.current = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (isMobile.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      addDots(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouse);

    const LIFESPAN = 1200; // ms

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();

      dots.current = dots.current.filter(dot => {
        const age = now - dot.birth;
        if (age > LIFESPAN) return false;

        const progress = age / LIFESPAN;
        const fadeOut = 1 - progress;
        const scale = 1 - progress * 0.6;

        ctx.save();
        ctx.globalAlpha = dot.opacity * fadeOut;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size * scale, 0, Math.PI * 2);

        // Gold radial gradient
        const grad = ctx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, dot.size * scale
        );
        grad.addColorStop(0, `rgba(255, 215, 0, ${0.7 * fadeOut})`);
        grad.addColorStop(0.5, `rgba(212, 175, 55, ${0.4 * fadeOut})`);
        grad.addColorStop(1, `rgba(184, 134, 11, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();

        return true;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, [addDots]);

  if (typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches)) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
