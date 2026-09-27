"use client";

import { useEffect, useRef } from "react";

const GLYPHS = [
  "0", "1", "·", "—", "/", "\\", "{", "}", "[", "]",
  "+", "−", "×", "÷", "~", "_", "<", ">", "|", "§",
  "HM", "C01", "C02", "C11", "::", "=>", "&&", "||", "404", "200",
  "λ", "π", "Δ", "∑", "∫", "≠", "≈", "#", "!", "?"
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  size: number;
  alpha: number;
  baseAlpha: number;
  rot: number;
  vrot: number;
  color: "ink" | "copper" | "soft";
}

export function CharacterBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Determine density based on screen size
    const isMobile = width < 768;
    const count = isMobile ? 22 : 48;

    let mouse = { x: -1000, y: -1000, active: false };

    // Palette helpers based on CSS variables
    const getColors = () => {
      const style = getComputedStyle(document.documentElement);
      const isDark =
        document.documentElement.dataset.theme === "dark" ||
        (document.documentElement.dataset.theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      return {
        ink: isDark ? "rgba(243, 239, 230, " : "rgba(28, 25, 22, ",
        copper: isDark ? "rgba(208, 137, 104, " : "rgba(138, 62, 36, ",
        soft: isDark ? "rgba(177, 168, 154, " : "rgba(94, 88, 78, ",
      };
    };

    let colors = getColors();

    const particles: Particle[] = Array.from({ length: count }, () => {
      const isSpecial = Math.random() < 0.25;
      const isCopper = Math.random() < 0.2;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)] || "0",
        size: isSpecial ? Math.floor(Math.random() * 4 + 14) : Math.floor(Math.random() * 6 + 11),
        baseAlpha: Math.random() * 0.18 + 0.08,
        alpha: 0.1,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.006,
        color: isCopper ? "copper" : Math.random() < 0.35 ? "soft" : "ink",
      };
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      colors = getColors();
    };

    resize();

    const onThemeChange = () => {
      colors = getColors();
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("keel-theme", onThemeChange);

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p) continue;

        if (!prefersReducedMotion) {
          p.x += p.vx * 60 * dt;
          p.y += p.vy * 60 * dt;
          p.rot += p.vrot * 60 * dt;

          // Wrap edges smoothly
          const pad = 40;
          if (p.x < -pad) p.x = width + pad;
          if (p.x > width + pad) p.x = -pad;
          if (p.y < -pad) p.y = height + pad;
          if (p.y > height + pad) p.y = -pad;

          // Mouse gentle deflection
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 130;
            if (dist < radius && dist > 0) {
              const force = (1 - dist / radius) * 0.8;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
              p.alpha = Math.min(p.baseAlpha * 2.2, 0.45);
            } else {
              p.alpha += (p.baseAlpha - p.alpha) * 0.05;
            }
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.05;
          }
        }

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.font = `${p.size}px var(--font-plex-mono), ui-monospace, SFMono-Regular, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const prefix = colors[p.color];
        ctx.fillStyle = `${prefix}${p.alpha.toFixed(3)})`;
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keel-theme", onThemeChange);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full select-none"
      style={{ opacity: 0.85 }}
    />
  );
}
