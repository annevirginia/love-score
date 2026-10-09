"use client";

import { useEffect, useState } from "react";

export default function HeartBackground() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generate pink, red, and purple floating romantic elements
    const symbols = ["❤️", "💖", "💜", "💕", "💘", "💓", "✨", "🌸", "🌹"];
    const generated = Array.from({ length: 26 }, (_, i) => ({
      id: i,
      symbol: symbols[i % symbols.length],
      left: `${(i * 3.8 + Math.random() * 4) % 96 + 2}%`,
      size: `${14 + (i % 6) * 5}px`,
      duration: `${8 + (i % 7) * 2.8}s`,
      delay: `${(i * 0.6) % 6}s`,
      opacity: 0.3 + (i % 4) * 0.15,
    }));
    setHearts(generated);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          style={{
            position: "absolute",
            bottom: "-35px",
            left: h.left,
            fontSize: h.size,
            opacity: h.opacity,
            animation: `floatUp ${h.duration} linear infinite`,
            animationDelay: h.delay,
            filter: "drop-shadow(0 2px 10px rgba(230, 0, 57, 0.35))",
            userSelect: "none",
          }}
        >
          {h.symbol}
        </span>
      ))}
    </div>
  );
}
