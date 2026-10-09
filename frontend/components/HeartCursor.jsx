"use client";

import { useEffect, useState } from "react";

export default function HeartCursor() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Only enable on pointer-capable devices
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let lastTime = 0;
    const icons = ["💖", "✨", "💕", "🌸", "💗"];

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < 65) return; // Throttle particle creation
      lastTime = now;

      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      const id = `${now}-${Math.random()}`;

      setParticles((prev) => [
        ...prev.slice(-15), // keep max 16 active particles
        {
          id,
          x: e.clientX,
          y: e.clientY,
          icon: randomIcon,
          size: `${12 + Math.random() * 8}px`,
        },
      ]);

      // Remove after animation finishes
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 750);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99999 }}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="cursor-heart-particle"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            fontSize: p.size,
          }}
        >
          {p.icon}
        </span>
      ))}
    </div>
  );
}
