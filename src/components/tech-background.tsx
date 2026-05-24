"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      pulse: number;
      pulseSpeed: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        });
      }
    };

    const drawConnections = () => {
      const maxDist = 150;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.15;
            ctx!.beginPath();
            ctx!.strokeStyle =
              theme === "dark"
                ? `rgba(100, 160, 255, ${opacity})`
                : `rgba(40, 100, 220, ${opacity})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient overlay
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 3,
        0,
        canvas.width / 2,
        canvas.height / 3,
        canvas.width * 0.6
      );
      if (theme === "dark") {
        gradient.addColorStop(0, "rgba(30, 80, 200, 0.08)");
        gradient.addColorStop(0.5, "rgba(20, 50, 150, 0.04)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        gradient.addColorStop(0, "rgba(100, 160, 255, 0.06)");
        gradient.addColorStop(0.5, "rgba(80, 130, 220, 0.03)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
        const currentSize = p.size * (0.8 + 0.2 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle =
          theme === "dark"
            ? `rgba(100, 180, 255, ${currentOpacity})`
            : `rgba(40, 100, 220, ${currentOpacity})`;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 3, 0, Math.PI * 2);
        const glowGrad = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          currentSize * 3
        );
        if (theme === "dark") {
          glowGrad.addColorStop(0, `rgba(80, 150, 255, ${currentOpacity * 0.3})`);
          glowGrad.addColorStop(1, "rgba(80, 150, 255, 0)");
        } else {
          glowGrad.addColorStop(0, `rgba(40, 100, 220, ${currentOpacity * 0.2})`);
          glowGrad.addColorStop(1, "rgba(40, 100, 220, 0)");
        }
        ctx.fillStyle = glowGrad;
        ctx.fill();
      });

      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
